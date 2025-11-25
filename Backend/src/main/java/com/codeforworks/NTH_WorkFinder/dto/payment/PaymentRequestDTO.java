package com.codeforworks.NTH_WorkFinder.dto.payment;

import jakarta.validation.constraints.AssertTrue;
import lombok.Data;

@Data
public class PaymentRequestDTO {
    private Long subscriptionId;
    private Double amount;
    private String paymentMethod = "VNPAY";
    
    @AssertTrue(message = "Phương thức thanh toán phải là VNPAY hoặc PAYPAL")
    private boolean isValidPaymentMethod() {
        return paymentMethod != null && 
               (paymentMethod.equals("VNPAY") || paymentMethod.equals("PAYPAL"));
    }
}
