package com.codeforworks.NTH_WorkFinder.repository;

import com.codeforworks.NTH_WorkFinder.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByInvoiceId(Long invoiceId);
    List<Payment> findByInvoiceSubscriptionEmployerId(Long employerId);
    List<Payment> findByPaymentDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    Optional<Payment> findBySubscriptionIdAndStatus(Long subscriptionId, Payment.PaymentStatus status);
    boolean existsByTransactionId(String transactionId);
    List<Payment> findBySubscriptionId(Long subscriptionId);
    List<Payment> findByStatus(Payment.PaymentStatus status);
    long countByStatus(Payment.PaymentStatus status);
    Optional<Payment> findByTransactionId(String transactionId);
    List<Payment> findByStatusAndSubscriptionId(Payment.PaymentStatus status, Long subscriptionId);
}
