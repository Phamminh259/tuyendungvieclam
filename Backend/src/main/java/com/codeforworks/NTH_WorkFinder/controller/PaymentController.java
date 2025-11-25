package com.codeforworks.NTH_WorkFinder.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codeforworks.NTH_WorkFinder.config.VNPayConfig;
import com.codeforworks.NTH_WorkFinder.dto.payment.AdminPaymentHistoryDTO;
import com.codeforworks.NTH_WorkFinder.dto.payment.PaymentHistoryDTO;
import com.codeforworks.NTH_WorkFinder.dto.payment.PaymentRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.payment.PaymentResponeDTO;
import com.codeforworks.NTH_WorkFinder.exception.ResourceNotFoundException;
import com.codeforworks.NTH_WorkFinder.model.Payment;
import com.codeforworks.NTH_WorkFinder.model.Payment.PaymentMethod;
import com.codeforworks.NTH_WorkFinder.model.Payment.PaymentStatus;
import com.codeforworks.NTH_WorkFinder.repository.PaymentRepository;
import com.codeforworks.NTH_WorkFinder.security.config.SecurityConfig;
import com.codeforworks.NTH_WorkFinder.service.IPaymentService;
import com.codeforworks.NTH_WorkFinder.service.impl.PayPalService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final IPaymentService paymentService;
    private final PayPalService paypalService;
    private final PaymentRepository paymentRepository;
    private final VNPayConfig vnPayConfig;

    @PostMapping("/create-payment")
    public ResponseEntity<?> createPayment(@Valid @RequestBody PaymentRequestDTO requestDTO) {
        try {
            // Tạo payment
            Payment payment = paymentService.createPayment(
                    requestDTO.getSubscriptionId(),
                    PaymentMethod.valueOf(requestDTO.getPaymentMethod())
            );

            String paymentUrl;
            if (payment.getPaymentMethod() == PaymentMethod.VNPAY) {
                paymentUrl = createVNPayUrl(payment);
            } else if (payment.getPaymentMethod() == PaymentMethod.PAYPAL) {
                paymentUrl = paypalService.createPaymentUrl(payment);
            } else {
                throw new IllegalArgumentException("Phương thức thanh toán không hợp lệ");
            }

            return ResponseEntity.ok(new PaymentResponeDTO(
                    "OK",
                    "Tạo thanh toán thành công",
                    paymentUrl
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new PaymentResponeDTO(
                    "ERROR",
                    e.getMessage(),
                    null
            ));
        }
    }

    @GetMapping("/vnpay-return")
    @Transactional
    public ResponseEntity<?> vnpayReturn(
            @RequestParam Map<String, String> allParams
    ) {
        try {
            String vnp_ResponseCode = allParams.get("vnp_ResponseCode");
            String vnp_TxnRef = allParams.get("vnp_TxnRef");
            String vnp_TransactionStatus = allParams.get("vnp_TransactionStatus");

            if ("00".equals(vnp_ResponseCode)) {
                Long paymentId = Long.valueOf(vnp_TxnRef);
                paymentService.handlePaymentSuccess(paymentId);

                Map<String, Object> response = new HashMap<>();
                response.put("status", "success");
                response.put("message", "Thanh toán thành công");
                return ResponseEntity.ok(response);
            } else {
                Long paymentId = Long.valueOf(vnp_TxnRef);
                String errorMessage = "Mã lỗi: " + vnp_ResponseCode;
                paymentService.handlePaymentFailure(paymentId, errorMessage);

                Map<String, Object> response = new HashMap<>();
                response.put("status", "error");
                response.put("message", "Thanh toán thất bại: " + errorMessage);
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Xử lý thanh toán thất bại: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }


    // Lấy payment theo id (ADMIN)
    @GetMapping("/{id}")
    public ResponseEntity<?> getPaymentById(@PathVariable Long id) {
        Payment payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(payment);
    }

    // Lấy payment theo invoice id (ADMIN)
    @GetMapping("/invoice/{invoiceId}")
    public ResponseEntity<?> getPaymentsByInvoiceId(@PathVariable Long invoiceId) {
        List<Payment> payments = paymentService.getPaymentsByInvoiceId(invoiceId);
        return ResponseEntity.ok(payments);
    }

    // Lấy lịch sử thanh toán theo employer id (EMPLOYER)
    @GetMapping("/employer/{employerId}/payments")
    public ResponseEntity<List<PaymentHistoryDTO>> getPaymentHistoryByEmployerId(@PathVariable Long employerId) {
        List<PaymentHistoryDTO> paymentHistory = paymentService.getPaymentHistoryByEmployerId(employerId);
        return ResponseEntity.ok(paymentHistory);
    }

    // Hủy thanh toán
    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<?> cancelPayment(@PathVariable Long id) {
        try {
            paymentService.cancelPayment(id);
            return ResponseEntity.ok("Thanh toán đã được hủy và các bản ghi liên quan đã bị xóa");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi hủy thanh toán: " + e.getMessage());
        }
    }

    // Lấy tất cả lịch sử thanh toán (ADMIN)
    @GetMapping("/history")
    public ResponseEntity<List<AdminPaymentHistoryDTO>> getAllPaymentHistory() {
        return ResponseEntity.ok(paymentService.getAllPaymentHistory());
    }

    // Lấy lịch sử thanh toán theo ngày (ADMIN)
    @GetMapping("/history/date-range")
    public ResponseEntity<List<AdminPaymentHistoryDTO>> getPaymentHistoryByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(paymentService.getPaymentHistoryByDateRange(startDate, endDate));
    }

    // Lấy thống kê thanh toán (ADMIN)
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getPaymentStatistics() {
        return ResponseEntity.ok(paymentService.getAdminPaymentStatistics());
    }

    // Tạo URL thanh toán VNPay
    public String createVNPayUrl(Payment payment) throws UnsupportedEncodingException {
        String vnp_TxnRef = String.valueOf(payment.getId());
        String vnp_IpAddr = "127.0.0.1";

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());

        long amount = (long) (payment.getAmount() * 100);

        String returnUrl = vnPayConfig.getVnpReturnUrl();

        Map<String, String> vnp_Params = new LinkedHashMap<>();
        vnp_Params.put("vnp_Version", VNPayConfig.vnp_Version);
        vnp_Params.put("vnp_Command", VNPayConfig.vnp_Command);
        vnp_Params.put("vnp_TmnCode", VNPayConfig.vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang: " + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_ReturnUrl", returnUrl);
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_BankCode", VNPayConfig.bankCode);

        // Tạo chuỗi hash data
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();

        for (String fieldName : fieldNames) {
            String fieldValue = vnp_Params.get(fieldName);
            if (fieldValue != null && fieldValue.length() > 0) {
                hashData.append(fieldName);
                hashData.append("=");
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (fieldNames.indexOf(fieldName) < fieldNames.size() - 1) {
                    hashData.append("&");
                }
            }
        }

        String secureHash = VNPayConfig.hmacSHA512(VNPayConfig.secretKey, hashData.toString());

        // Thêm hash vào params
        vnp_Params.put("vnp_SecureHash", secureHash);

        // Build URL
        StringBuilder queryUrl = new StringBuilder(VNPayConfig.vnp_PayUrl + "?");
        for (Map.Entry<String, String> entry : vnp_Params.entrySet()) {
            queryUrl.append(URLEncoder.encode(entry.getKey(), StandardCharsets.US_ASCII.toString()));
            queryUrl.append("=");
            queryUrl.append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII.toString()));
            queryUrl.append("&");
        }

        String finalUrl = queryUrl.substring(0, queryUrl.length() - 1);
        return finalUrl;
    }

    // Thêm endpoint xử lý callback từ PayPal
    @GetMapping("/paypal/success")
    public ResponseEntity<?> paypalSuccess(
            @RequestParam("paymentId") String paymentId,
            @RequestParam("PayerID") String payerId,
            @RequestParam("token") String token) {
        try {
            // Tìm payment PENDING gần nhất
            List<Payment> pendingPayments = paymentRepository.findByStatus(PaymentStatus.PENDING);
            if (pendingPayments.isEmpty()) {
                throw new ResourceNotFoundException("Không tìm thấy payment đang chờ thanh toán");
            }
            Payment payment = pendingPayments.get(0);

            // Xử lý thanh toán thành công
            paymentService.handlePayPalSuccess(paymentId, payerId, token);

            // Redirect về trang thành công
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Thanh toán PayPal thành công"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", "Thanh toán PayPal thất bại: " + e.getMessage()
            ));
        }
    }
}
