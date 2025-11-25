package com.codeforworks.NTH_WorkFinder.service.impl;

import com.codeforworks.NTH_WorkFinder.model.Payment;
import com.codeforworks.NTH_WorkFinder.model.Subscription;
import com.codeforworks.NTH_WorkFinder.model.Payment.PaymentMethod;
import com.codeforworks.NTH_WorkFinder.model.Payment.PaymentStatus;
import com.codeforworks.NTH_WorkFinder.exception.ResourceNotFoundException;
import com.codeforworks.NTH_WorkFinder.model.Invoice;
import com.codeforworks.NTH_WorkFinder.model.Invoice.InvoiceStatus;
import com.codeforworks.NTH_WorkFinder.repository.PaymentRepository;
import com.codeforworks.NTH_WorkFinder.repository.SubscriptionRepository;
import com.codeforworks.NTH_WorkFinder.repository.InvoiceRepository;
import com.codeforworks.NTH_WorkFinder.service.IPaymentService;
import com.paypal.base.rest.PayPalRESTException;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;
import java.time.LocalDate;
import java.util.stream.Collectors;
import com.codeforworks.NTH_WorkFinder.dto.payment.PaymentHistoryDTO;
import com.codeforworks.NTH_WorkFinder.dto.payment.AdminPaymentHistoryDTO;
import com.codeforworks.NTH_WorkFinder.mapper.PaymentMapper;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
public class PaymentService implements IPaymentService {

    private final Logger logger = LoggerFactory.getLogger(PaymentService.class);
    private final PayPalService paypalService;
    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionService subscriptionService;
    private final PaymentMapper paymentMapper;

    // Tạo thanh toán
    @Override
    public Payment createPayment(Long subscriptionId, PaymentMethod paymentMethod) throws PayPalRESTException {
        try {
            // Kiểm tra subscription
            Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy subscription"));
            
            // Kiểm tra payment đang pending
            List<Payment> existingPayments = paymentRepository.findBySubscriptionId(subscriptionId);
            if (!existingPayments.isEmpty()) {
                logger.info("Found existing payment for subscription {}", subscriptionId);
                return existingPayments.get(0);
            }

            // Tìm hoặc tạo invoice mới
            Invoice invoice = invoiceRepository.findBySubscriptionId(subscriptionId)
                .orElseGet(() -> {
                    Invoice newInvoice = new Invoice();
                    newInvoice.setSubscription(subscription);
                    newInvoice.setAmount(subscription.getPackageEntity().getPrice());
                    newInvoice.setStatus(InvoiceStatus.PENDING);
                    return invoiceRepository.save(newInvoice);
                });

            // Tạo payment mới
            Payment payment = new Payment();
            payment.setInvoice(invoice);
            payment.setSubscription(subscription);
            payment.setAmount(invoice.getAmount());
            payment.setPaymentMethod(paymentMethod);
            payment.setPaymentDate(new Date());
            payment.setStatus(PaymentStatus.PENDING);

            if (paymentMethod == PaymentMethod.PAYPAL) {
                String paypalUrl = paypalService.createPaymentUrl(payment);
                logger.info("Full PayPal URL: {}", paypalUrl);
                
                // Lấy token từ URL
                String token = "";
                if (paypalUrl.contains("token=")) {
                    token = paypalUrl.split("token=")[1];
                    if (token.contains("&")) {
                        token = token.split("&")[0];
                    }
                }
                
                logger.info("Extracted token: {}", token);
                if (token.isEmpty()) {
                    throw new RuntimeException("Failed to extract PayPal token");
                }
                
                logger.info("Creating payment with token: {}", token);
                payment.setTransactionId(token);
            }
            else {
                payment.setTransactionId(generateTransactionId());
            }

            Payment savedPayment = paymentRepository.save(payment);
            logger.info("Payment saved with ID: {} and token: {}", 
                savedPayment.getId(), savedPayment.getTransactionId());
            
            // Verify saved payment
            Payment verifiedPayment = paymentRepository.findById(savedPayment.getId()).orElse(null);
            if (verifiedPayment != null) {
                logger.info("Verified saved payment - ID: {}, Token: {}", 
                    verifiedPayment.getId(), verifiedPayment.getTransactionId());
            }
            
            return savedPayment;
            
        } catch (Exception e) {
            logger.error("Error in createPayment: ", e);
            throw e;
        }
    }
    private String generateTransactionId() {
        return "TXN" + System.currentTimeMillis();
    }

    @Override
    public void handlePayPalSuccess(String paymentId, String payerId, String token) {
        logger.info("=== START PayPal Success Handler ===");
        logger.info("Received callback with token: {}", token);
        
        try {
            // Tìm payment gần nhất theo subscription
            List<Payment> pendingPayments = paymentRepository.findByStatus(PaymentStatus.PENDING);
            logger.info("Found {} pending payments", pendingPayments.size());
            
            // Lấy payment gần nhất
            Payment payment = pendingPayments.stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy payment đang chờ thanh toán"));

            // Cập nhật token mới từ PayPal
            payment.setTransactionId(token);
            payment.setStatus(PaymentStatus.SUCCESS);
            paymentRepository.save(payment);

            // Cập nhật invoice
            Invoice invoice = payment.getInvoice();
            invoice.setStatus(InvoiceStatus.PAID); // PAID: Đã thanh toán
            invoiceRepository.save(invoice);
            // Kích hoạt subscription
            subscriptionService.activateSubscription(invoice.getSubscription().getId());
        
            logger.debug("Thanh toán thành công: Payment {} - Invoice {}", payment.getId(), invoice.getId());
        } catch (Exception e) {
            logger.error("Error in handlePayPalSuccess: ", e);
            throw e;
        }
    }

    // Xử lý thanh toán thành công
    @Override
    public void handlePaymentSuccess(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy payment"));
        
        // Cập nhật payment
        payment.setStatus(PaymentStatus.SUCCESS); // SUCCESS: Thành công
        paymentRepository.save(payment);
        
        // Cập nhật invoice
        Invoice invoice = payment.getInvoice();
        invoice.setStatus(InvoiceStatus.PAID); // PAID: Đã thanh toán
        invoiceRepository.save(invoice);
        
        // Kích hoạt subscription
        subscriptionService.activateSubscription(invoice.getSubscription().getId());
        
        logger.debug("Thanh toán thành công: Payment {} - Invoice {}", paymentId, invoice.getId());
    }

    // Xử lý thanh toán thất bại
    @Override
    public void handlePaymentFailure(Long paymentId, String errorMessage) {
        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy payment"));
        
        payment.setStatus(PaymentStatus.FAILED); // FAILED: Thất bại
        payment.setPaymentInfo(errorMessage);
        paymentRepository.save(payment);
        
        logger.error("Thanh toán thất bại: Payment {} - {}", paymentId, errorMessage);
    }

    // Lấy payment theo id
    @Override
    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy payment"));
    }

    // Lấy payment theo invoice id
    @Override
    public List<Payment> getPaymentsByInvoiceId(Long invoiceId) {
        return paymentRepository.findByInvoiceId(invoiceId);
    }


    // Lấy lịch sử thanh toán theo employer id (EMPLOYER)
    @Override
    public List<PaymentHistoryDTO> getPaymentHistoryByEmployerId(Long employerId) {
        List<Payment> payments = paymentRepository.findByInvoiceSubscriptionEmployerId(employerId);
        return payments.stream()
                       .map(paymentMapper::toPaymentHistoryDTO)
                       .collect(Collectors.toList());
    }

    // Lấy thống kê payment theo ngày
    @Override
    public Map<String, Object> getPaymentStatistics(LocalDate startDate, LocalDate endDate) {
        List<Payment> payments = getPaymentsByDateRange(startDate, endDate);
        Map<String, Object> statistics = new HashMap<>();
        statistics.put("totalPayments", payments.size());
        statistics.put("totalAmount", payments.stream().mapToDouble(Payment::getAmount).sum());
        return statistics;
    }
    public List<Payment> getPaymentsByDateRange(LocalDate startDate, LocalDate endDate) {
        return paymentRepository.findByPaymentDateBetween(
            startDate.atStartOfDay(), 
            endDate.atTime(23, 59, 59)
        );
    }

    // Hủy thanh toán
    @Override
    public void cancelPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy payment"));

        // Lấy invoice và subscription liên quan
        Invoice invoice = payment.getInvoice();
        Subscription subscription = payment.getSubscription();

        // Xóa payment
        paymentRepository.delete(payment);

        // Xóa invoice nếu cần
        if (invoice != null) {
            invoiceRepository.delete(invoice);
        }

        // Xóa subscription nếu cần
        if (subscription != null) {
            subscriptionRepository.delete(subscription);
        }

        logger.debug("Đã hủy thanh toán và xóa các bản ghi liên quan: Payment {}, Invoice {}, Subscription {}",
            paymentId, invoice != null ? invoice.getId() : "null", subscription != null ? subscription.getId() : "null");
    }

    // Kiểm tra và cập nhật trạng thái của các payment chưa thanh toán
    @Scheduled(fixedRate = 60000) // 1 phút
    public void updatePendingPayments() {
        List<Payment> pendingPayments = paymentRepository.findByStatus(PaymentStatus.PENDING);
        Date now = new Date();
        for (Payment payment : pendingPayments) {
            long diffInMinutes = (now.getTime() - payment.getPaymentDate().getTime()) / (60 * 1000);
            if (diffInMinutes > 40) {
                // Cập nhật trạng thái payment
                payment.setStatus(PaymentStatus.FAILED);
                paymentRepository.save(payment);

                // Cập nhật trạng thái invoice
                Invoice invoice = payment.getInvoice();
                if (invoice != null) {
                    invoice.setStatus(InvoiceStatus.CANCELLED);
                    invoiceRepository.save(invoice);
                }

                logger.debug("Payment {} chuyển sang FAILED và Invoice {} chuyển sang CANCELLED do quá thời gian thanh toán", payment.getId(), invoice != null ? invoice.getId() : "null");
            }
        }
    }

    // Lấy tất cả lịch sử thanh toán (ADMIN)
    @Override
    public List<AdminPaymentHistoryDTO> getAllPaymentHistory() {
        List<Payment> payments = paymentRepository.findAll();
        return payments.stream()
            .map(payment -> {
                AdminPaymentHistoryDTO dto = new AdminPaymentHistoryDTO();
                dto.setPaymentId(payment.getId());
                dto.setCompanyName(payment.getSubscription().getEmployer().getCompanyName());
                dto.setPackageName(payment.getSubscription().getPackageEntity().getPackageName());
                dto.setAmount(payment.getAmount());
                dto.setPaymentDate(payment.getPaymentDate());
                dto.setStartDate(payment.getSubscription().getStartDate());
                dto.setEndDate(payment.getSubscription().getEndDate());
                dto.setPaymentMethod(payment.getPaymentMethod().name());
                dto.setPaymentStatus(payment.getStatus().name());
                dto.setInvoiceNumber(payment.getInvoice().getInvoiceNumber());
                dto.setTransactionId(payment.getTransactionId());
                dto.setInvoiceStatus(payment.getInvoice().getStatus().name());
                return dto;
            })
            .collect(Collectors.toList());
    }

    // Lấy lịch sử thanh toán theo ngày (ADMIN)
    @Override
    public List<AdminPaymentHistoryDTO> getPaymentHistoryByDateRange(LocalDate startDate, LocalDate endDate) {
        List<Payment> payments = paymentRepository.findByPaymentDateBetween(
            startDate.atStartOfDay(),
            endDate.atTime(23, 59, 59)
        );
        return payments.stream()
            .map(payment -> {
                AdminPaymentHistoryDTO dto = new AdminPaymentHistoryDTO();
                dto.setPaymentId(payment.getId());
                dto.setCompanyName(payment.getSubscription().getEmployer().getCompanyName());
                dto.setPackageName(payment.getSubscription().getPackageEntity().getPackageName());
                dto.setAmount(payment.getAmount());
                dto.setPaymentDate(payment.getPaymentDate());
                dto.setStartDate(payment.getSubscription().getStartDate());
                dto.setEndDate(payment.getSubscription().getEndDate());
                dto.setPaymentMethod(payment.getPaymentMethod().name());
                dto.setPaymentStatus(payment.getStatus().name());
                dto.setInvoiceNumber(payment.getInvoice().getInvoiceNumber());
                dto.setTransactionId(payment.getTransactionId());
                dto.setInvoiceStatus(payment.getInvoice().getStatus().name());
                return dto;
            })
            .collect(Collectors.toList());
    }

    // Lấy thống kê thanh toán (ADMIN)
    @Override
    public Map<String, Object> getAdminPaymentStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        // Tổng số giao dịch
        long totalTransactions = paymentRepository.count();
        statistics.put("totalTransactions", totalTransactions);
        
        // Tổng doanh thu
        Double totalRevenue = paymentRepository.findAll().stream()
            .filter(p -> p.getStatus() == PaymentStatus.SUCCESS)
            .mapToDouble(Payment::getAmount)
            .sum();
        statistics.put("totalRevenue", totalRevenue);
        
        // Số giao dịch thành công
        long successfulTransactions = paymentRepository.countByStatus(PaymentStatus.SUCCESS);
        statistics.put("successfulTransactions", successfulTransactions);
        
        // Số giao dịch thất bại
        long failedTransactions = paymentRepository.countByStatus(PaymentStatus.FAILED);
        statistics.put("failedTransactions", failedTransactions);
        
        return statistics;
    }

} 