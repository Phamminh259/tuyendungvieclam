package com.codeforworks.NTH_WorkFinder.service;

import com.codeforworks.NTH_WorkFinder.dto.payment.AdminPaymentHistoryDTO;
import com.codeforworks.NTH_WorkFinder.dto.payment.PaymentHistoryDTO;
import com.codeforworks.NTH_WorkFinder.model.Payment;
import com.paypal.base.rest.PayPalRESTException;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface IPaymentService {
    Payment createPayment(Long subscriptionId, Payment.PaymentMethod paymentMethod) throws PayPalRESTException;
    void handlePaymentSuccess(Long paymentId);
    void handlePaymentFailure(Long paymentId, String errorMessage);
    Payment getPaymentById(Long id);
    List<Payment> getPaymentsByInvoiceId(Long invoiceId);
    List<PaymentHistoryDTO> getPaymentHistoryByEmployerId(Long employerId);
    Map<String, Object> getPaymentStatistics(LocalDate startDate, LocalDate endDate);
    void cancelPayment(Long paymentId);
    List<AdminPaymentHistoryDTO> getAllPaymentHistory();
    List<AdminPaymentHistoryDTO> getPaymentHistoryByDateRange(LocalDate startDate, LocalDate endDate);
    Map<String, Object> getAdminPaymentStatistics();
    void handlePayPalSuccess(String paymentId, String payerId, String token);
}
