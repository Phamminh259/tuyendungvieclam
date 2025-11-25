package com.codeforworks.NTH_WorkFinder.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codeforworks.NTH_WorkFinder.config.VNPayConfig;
import com.codeforworks.NTH_WorkFinder.dto.payment.PaymentResponeDTO;
import com.codeforworks.NTH_WorkFinder.dto.subscription.SubscriptionRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.subscription.SubscriptionResponseDTO;
import com.codeforworks.NTH_WorkFinder.model.Payment;
import com.codeforworks.NTH_WorkFinder.model.Payment.PaymentMethod;
import com.codeforworks.NTH_WorkFinder.service.IPaymentService;
import com.codeforworks.NTH_WorkFinder.service.ISubscriptionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {
    private final ISubscriptionService subscriptionService;

    private final IPaymentService paymentService;

    private final PaymentController paymentController;

    private final VNPayConfig vnPayConfig;

    // Lấy tất cả subscription (ADMIN)
    @GetMapping
    public ResponseEntity<List<SubscriptionResponseDTO>> getAllSubscriptions() {
        return ResponseEntity.ok(subscriptionService.getAllSubscriptions());
    }

    // Lấy tất cả subscription đã thanh toán (ADMIN)
    @GetMapping("/active")
    public ResponseEntity<List<SubscriptionResponseDTO>> getAllSubscriptionsByIsActiveTrue() {
        return ResponseEntity.ok(subscriptionService.getAllSubscriptionsByIsActiveTrue());
    }

    // Đăng ký gói dịch vụ (EMPLOYER)
    @PostMapping
    public ResponseEntity<SubscriptionResponseDTO> createSubscription(@RequestBody SubscriptionRequestDTO requestDTO) {
        return ResponseEntity.ok(subscriptionService.createSubscription(requestDTO));
    }

    // Lấy chi tiết gói dịch vụ theo id (EMPLOYER)
    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionResponseDTO> getSubscription(@PathVariable Long id) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionById(id));
    }

    // Lấy danh sách gói dịch vụ theo employer (EMPLOYER + ADMIN)
    @GetMapping("/employer/{employerId}")
    public ResponseEntity<List<SubscriptionResponseDTO>> getSubscriptionsByEmployer(@PathVariable Long employerId) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionsByEmployerId(employerId));
    }

    // Lấy danh sách gói dịch vụ theo employer đã thanh toán (EMPLOYER + ADMIN)
    @GetMapping("/employer/{employerId}/active")
    public ResponseEntity<List<SubscriptionResponseDTO>> getSubscriptionsByEmployerAndIsActiveTrue(@PathVariable Long employerId) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionsByEmployerIdAndIsActiveTrue(employerId));
    }

    // Hủy gói dịch vụ (EMPLOYER)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelSubscription(@PathVariable Long id) {
        subscriptionService.cancelSubscription(id);
        return ResponseEntity.ok().build();
    }

    // Gia hạn gói dịch vụ (EMPLOYER)
    @PutMapping("/{id}/renew")
    public ResponseEntity<?> renewSubscription(
            @PathVariable Long id,
            @RequestParam Integer duration) {
        try {
            // Tạo subscription mới
            SubscriptionResponseDTO renewedSub = subscriptionService.renewSubscription(id, duration);
            
            // Tạo payment và lấy URL VNPay
            Payment payment = paymentService.createPayment(renewedSub.getId(), PaymentMethod.VNPAY);
            String paymentUrl = paymentController.createVNPayUrl(payment);
            
            return ResponseEntity.ok(new PaymentResponeDTO(
                "OK",
                "Tạo gia hạn và thanh toán thành công",
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

    // Kiểm tra gói dịch vụ còn hiệu lực (EMPLOYER)
    @GetMapping("/active/{employerId}")
    public ResponseEntity<Boolean> isSubscriptionActive(@PathVariable Long employerId) {
        return ResponseEntity.ok(subscriptionService.isSubscriptionActive(employerId));
    }

    // lấy gói hiện tại của employer
    @GetMapping("/current/{employerId}")
    public ResponseEntity<SubscriptionResponseDTO> getCurrentSubscription(@PathVariable Long employerId) {
        return ResponseEntity.ok(subscriptionService.getCurrentSubscription(employerId));
    }
}
