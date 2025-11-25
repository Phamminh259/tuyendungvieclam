package com.codeforworks.NTH_WorkFinder.service.impl;

import com.codeforworks.NTH_WorkFinder.config.AppConfig;
import com.codeforworks.NTH_WorkFinder.model.Payment;
import com.paypal.api.payments.Amount;
import com.paypal.api.payments.Payer;
import com.paypal.api.payments.PaymentExecution;
import com.paypal.api.payments.RedirectUrls;
import com.paypal.api.payments.Transaction;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class PayPalService {
    private final APIContext apiContext;
    private final AppConfig appConfig;
    
    public String createPaymentUrl(Payment localPayment) throws PayPalRESTException {
        // Tạo payment của PayPal
        com.paypal.api.payments.Amount paypalAmount = new com.paypal.api.payments.Amount();
        paypalAmount.setCurrency("USD");
        
        // Format số tiền theo đúng yêu cầu của PayPal (2 số thập phân)
        double usdAmount = Math.round(localPayment.getAmount() / 24000.0 * 100.0) / 100.0;
        paypalAmount.setTotal(String.format(Locale.US, "%.2f", usdAmount));

        Transaction transaction = new Transaction();
        transaction.setDescription("Thanh toán cho gói dịch vụ #" + localPayment.getSubscription().getId());
        transaction.setAmount(paypalAmount);

        List<Transaction> transactions = new ArrayList<>();
        transactions.add(transaction);

        Payer payer = new Payer();
        payer.setPaymentMethod("paypal");

        com.paypal.api.payments.Payment paypalPayment = new com.paypal.api.payments.Payment();
        paypalPayment.setIntent("sale");
        paypalPayment.setPayer(payer);
        paypalPayment.setTransactions(transactions);

        RedirectUrls redirectUrls = new RedirectUrls();
        redirectUrls.setCancelUrl(appConfig.getFrontendUrl() + "/payment/cancel");
        redirectUrls.setReturnUrl(appConfig.getFrontendUrl() + "/paypal-callback");
        paypalPayment.setRedirectUrls(redirectUrls);

        com.paypal.api.payments.Payment createdPaypalPayment = paypalPayment.create(apiContext);

        return createdPaypalPayment.getLinks().stream()
            .filter(link -> link.getRel().equals("approval_url"))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Không tìm thấy URL thanh toán PayPal"))
            .getHref();
    }

    public com.paypal.api.payments.Payment executePaypalPayment(String paymentId, String payerId) throws PayPalRESTException {
        com.paypal.api.payments.Payment paypalPayment = new com.paypal.api.payments.Payment();
        paypalPayment.setId(paymentId);
        
        PaymentExecution paymentExecution = new PaymentExecution();
        paymentExecution.setPayerId(payerId);
        
        return paypalPayment.execute(apiContext, paymentExecution);
    }
} 