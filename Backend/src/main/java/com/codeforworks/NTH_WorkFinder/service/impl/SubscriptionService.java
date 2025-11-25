package com.codeforworks.NTH_WorkFinder.service.impl;

import com.codeforworks.NTH_WorkFinder.dto.subscription.SubscriptionRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.subscription.SubscriptionResponseDTO;
import com.codeforworks.NTH_WorkFinder.exception.InvalidOperationException;
import com.codeforworks.NTH_WorkFinder.exception.ResourceNotFoundException;
import com.codeforworks.NTH_WorkFinder.mapper.SubscriptionMapper;
import com.codeforworks.NTH_WorkFinder.model.Employer;
import com.codeforworks.NTH_WorkFinder.model.Invoice;
import com.codeforworks.NTH_WorkFinder.model.Package;
import com.codeforworks.NTH_WorkFinder.model.Payment;
import com.codeforworks.NTH_WorkFinder.model.Subscription;
import com.codeforworks.NTH_WorkFinder.repository.EmployerRepository;
import com.codeforworks.NTH_WorkFinder.repository.InvoiceRepository;
import com.codeforworks.NTH_WorkFinder.repository.PackageRepository;
import com.codeforworks.NTH_WorkFinder.repository.PaymentRepository;
import com.codeforworks.NTH_WorkFinder.repository.SubscriptionRepository;
import com.codeforworks.NTH_WorkFinder.security.service.EmailService;
import com.codeforworks.NTH_WorkFinder.service.ISubscriptionService;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class SubscriptionService implements ISubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final EmployerRepository employerRepository;
    private final PackageRepository packageRepository;
    private final SubscriptionMapper subscriptionMapper;
    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private static final Logger logger = LoggerFactory.getLogger(SubscriptionService.class);
    private final EmailService emailService;

    // Đăng ký gói dịch vụ mới
    @Override
    public SubscriptionResponseDTO createSubscription(SubscriptionRequestDTO requestDTO) {
        // Kiểm tra employer tồn tại
        Employer employer = employerRepository.findById(requestDTO.getEmployerId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhà tuyển dụng"));

        // Kiểm tra package tồn tại
        Package selectedPackage = packageRepository.findById(requestDTO.getPackageId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy gói dịch vụ"));

        // Lấy danh sách các gói đã mua
        List<Subscription> existingSubscriptions = subscriptionRepository.findByEmployerId(employer.getId());

        // Kiểm tra logic mua gói
        boolean canPurchase = true;
        for (Subscription sub : existingSubscriptions) {
            Long packageId = sub.getPackageEntity().getId();
            if (packageId == 1 && (selectedPackage.getId() == 2 || selectedPackage.getId() == 3)) {
                canPurchase = true;
            } else if (packageId == 2 && selectedPackage.getId() == 1) {
                canPurchase = false;
                break;
            } else if (packageId == 3 && (selectedPackage.getId() == 1 || selectedPackage.getId() == 2)) {
                canPurchase = false;
                break;
            }
        }

        if (!canPurchase) {
            throw new InvalidOperationException("Không thể mua gói này do đã sở hữu gói không tương thích.");
        }

        // Tạo subscription mới
        Subscription subscription = new Subscription();
        subscription.setEmployer(employer);
        subscription.setPackageEntity(selectedPackage);

        // Set ngày dự kiến
        subscription.setStartDate(new Date());
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(subscription.getStartDate());
        calendar.add(Calendar.DAY_OF_MONTH, selectedPackage.getDuration());
        subscription.setEndDate(calendar.getTime());

        subscription.setIsActive(false);
        Subscription savedSubscription = subscriptionRepository.save(subscription);
        logger.info("Tạo đăng ký mới: Employer {} - Package {}", employer.getId(), selectedPackage.getId());

        // Tự động tạo Invoice
        Invoice invoice = new Invoice();
        invoice.setSubscription(savedSubscription);
        invoice.setAmount(selectedPackage.getPrice());
        invoice.setCode(generateInvoiceCode());
        invoice.setInvoiceNumber(generateInvoiceNumber());
        invoice.setIssueDate(new Date());
        invoice.setStatus(Invoice.InvoiceStatus.PENDING);
        invoice.setDescription("Thanh toán gói " + selectedPackage.getPackageName());
        invoiceRepository.save(invoice);

        return subscriptionMapper.toSubscriptionResponseDTO(savedSubscription);
    }

    private String generateInvoiceCode() {
        return "INV" + System.currentTimeMillis();
    }

    private String generateInvoiceNumber() {
        return String.format("%010d", System.currentTimeMillis() % 10000000000L);
    }

    // Lấy chi tiết gói dịch vụ theo id
    @Override
    public SubscriptionResponseDTO getSubscriptionById(Long id) {
        Subscription subscription = subscriptionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy subscription"));

        // Lấy danh sách payment liên quan đến subscription
        List<Payment> payments = paymentRepository.findBySubscriptionId(subscription.getId());
        Payment payment = payments.isEmpty() ? null : payments.get(0); // Giả sử chỉ có một payment liên quan

        Invoice invoice = invoiceRepository.findBySubscriptionId(subscription.getId())
            .orElse(null);

        SubscriptionResponseDTO responseDTO = subscriptionMapper.toSubscriptionResponseDTO(subscription);
        if (payment != null) {
            responseDTO.setPaymentId(payment.getId());
        }
        if (invoice != null) {
            responseDTO.setInvoiceId(invoice.getId());
        }
        return responseDTO;
    }

    // Lấy danh sách gói dịch vụ theo employer
    @Override
    public List<SubscriptionResponseDTO> getSubscriptionsByEmployerId(Long employerId) {
        List<Subscription> subscriptions = subscriptionRepository.findByEmployerId(employerId);
        return subscriptions.stream()
                .map(subscriptionMapper::toSubscriptionResponseDTO)
                .toList();
    }

    // Lấy danh sách gói dịch vụ theo employer đã thanh toán
    @Override
    public List<SubscriptionResponseDTO> getSubscriptionsByEmployerIdAndIsActiveTrue(Long employerId) {
        List<Subscription> subscriptions = subscriptionRepository.findByEmployerIdAndIsActiveTrue(employerId);
        return subscriptions.stream()
                .map(subscriptionMapper::toSubscriptionResponseDTO)
                .toList();
    }

    // Lấy danh sách tất cả subscription (ADMIN)
    @Override
    public List<SubscriptionResponseDTO> getAllSubscriptions() {
        return subscriptionRepository.findAll().stream()
                .map(subscriptionMapper::toSubscriptionResponseDTO)
                .toList();
    }

 
    // lấy danh sách subcription đã thanh toán (ADMIN)
    @Override
    public List<SubscriptionResponseDTO> getAllSubscriptionsByIsActiveTrue() {
        return subscriptionRepository.findByIsActiveTrue().stream()
                .map(subscriptionMapper::toSubscriptionResponseDTO)
                .toList();
    }
    
    // Hủy gói dịch vụ
    @Override
    public void cancelSubscription(Long id) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đăng ký"));

        // Hủy subscription
        subscription.setIsActive(false);
        subscription.setEndDate(new Date());
        subscriptionRepository.save(subscription);

        // Hủy invoice liên quan
        Invoice invoice = subscription.getInvoice();
        if (invoice != null) {
            invoice.setStatus(Invoice.InvoiceStatus.CANCELLED);
            invoice.setNote("Hủy do subscription bị hủy");
            invoiceRepository.save(invoice);
        }

        logger.info("Hủy đăng ký và hóa đơn: {}", id);
    }

    // Kiểm tra gói dịch vụ còn hiệu lực
    @Override
    public boolean isSubscriptionActive(Long employerId) {
        return subscriptionRepository.existsByEmployerIdAndIsActiveTrueAndEndDateAfter(
                employerId, new Date());
    }

    // Gia hạn gói dịch vụ 
    @Override
    public SubscriptionResponseDTO renewSubscription(Long id, Integer duration) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy subscription"));

        // Tạo subscription mới cho việc gia hạn
        Subscription renewalSubscription = new Subscription();
        renewalSubscription.setEmployer(subscription.getEmployer());
        renewalSubscription.setPackageEntity(subscription.getPackageEntity());
        renewalSubscription.setIsActive(false); // Chưa active cho đến khi thanh toán

        // Set thời gian cho gói gia hạn
        Date startDate = subscription.getEndDate(); // Bắt đầu từ ngày hết hạn gói cũ
        renewalSubscription.setStartDate(startDate);
        
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(startDate);
        calendar.add(Calendar.DAY_OF_MONTH, duration);
        renewalSubscription.setEndDate(calendar.getTime());

        Subscription savedSubscription = subscriptionRepository.save(renewalSubscription);

        // Tạo hóa đơn cho việc gia hạn
        Invoice invoice = new Invoice();
        invoice.setSubscription(savedSubscription);
        invoice.setAmount(subscription.getPackageEntity().getPrice() * (duration / 30.0)); // Tính tiền theo tháng
        invoice.setCode(generateInvoiceCode());
        invoice.setInvoiceNumber(generateInvoiceNumber());
        invoice.setIssueDate(new Date());
        invoice.setStatus(Invoice.InvoiceStatus.PENDING);
        invoice.setDescription("Gia hạn gói " + subscription.getPackageEntity().getPackageName());
        invoiceRepository.save(invoice);

        return subscriptionMapper.toSubscriptionResponseDTO(savedSubscription);
    }


    // Payment xử lý: Kích hoạt subscription sau khi thanh toán thành công
    public void activateSubscription(Long subscriptionId) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy subscription"));

        subscription.setIsActive(true);
        subscription.setStartDate(new Date()); // Set startDate khi kích hoạt
        // Không cập nhật lại endDate vì đã được set khi tạo subscription
        
        subscriptionRepository.save(subscription);
        logger.info("Kích hoạt subscription {}: startDate={}, endDate={}", 
            subscriptionId, subscription.getStartDate(), subscription.getEndDate());
    }

    // lấy gói hiện tại của employer
    @Override
    public SubscriptionResponseDTO getCurrentSubscription(Long employerId) {
        List<Subscription> subscriptions = subscriptionRepository.findByEmployerIdAndIsActiveTrue(employerId);

        if (subscriptions.isEmpty()) {
            throw new ResourceNotFoundException("Không tìm thấy subscription đang hoạt động");
        }

        Date now = new Date();

        // Lọc các subscription còn hạn
        List<Subscription> validSubscriptions = subscriptions.stream()
            .filter(sub -> sub.getEndDate().after(now))
            .toList();

        if (validSubscriptions.isEmpty()) {
            throw new ResourceNotFoundException("Không tìm thấy subscription còn hiệu lực");
        }

        // Ưu tiên theo thứ tự:
        // 1. Gói cao cấp nhất (id lớn nhất) còn hạn
        // 2. Nếu cùng gói thì lấy gói có endDate xa nhất
        return validSubscriptions.stream()
            .map(sub -> new Object() {
                Subscription subscription = sub;
                Long packageId = sub.getPackageEntity().getId();
                Date endDate = sub.getEndDate();
            })
            .max((a, b) -> {
                // So sánh packageId trước
                int packageCompare = a.packageId.compareTo(b.packageId);
                if (packageCompare != 0) {
                    return packageCompare; // Ưu tiên package id cao hơn
                }
                // Nếu cùng package thì so sánh endDate
                return a.endDate.compareTo(b.endDate);
            })
            .map(obj -> subscriptionMapper.toSubscriptionResponseDTO(obj.subscription))
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy subscription đang hoạt động"));
    }

    // Kiểm tra subscription hết hạn và gửi email thông báo
    @Scheduled(cron = "0 0 0 * * ?") // Chạy lúc 00:00 mỗi ngày
    public void checkAndUpdateExpiredSubscriptions() {
        logger.info("Bắt đầu kiểm tra subscription hết hạn");
        Date now = new Date();
        
        List<Subscription> activeSubscriptions = subscriptionRepository.findByIsActiveTrue();
        
        for (Subscription subscription : activeSubscriptions) {
            if (subscription.getEndDate() != null && subscription.getEndDate().before(now)) {
                logger.info("Subscription {} đã hết hạn vào ngày {}", 
                    subscription.getId(), subscription.getEndDate());
                
                subscription.setIsActive(false);
                subscriptionRepository.save(subscription);
                
                // Gửi email thông báo cho employer (optional)
                try {
                    String employerEmail = subscription.getEmployer().getAccount().getEmail();
                    emailService.sendSubscriptionExpiredNotification(
                        employerEmail, 
                        subscription.getPackageEntity().getPackageName(),
                        subscription.getEndDate()
                    );
                } catch (Exception e) {
                    logger.error("Lỗi khi gửi email thông báo hết hạn: {}", e.getMessage());
                }
            }
        }
        logger.info("Hoàn thành kiểm tra subscription hết hạn");
    }

}
