package com.codeforworks.NTH_WorkFinder.dto.payment;

import lombok.Data;
import java.util.Date;

@Data
public class PaymentHistoryDTO {
    private Long id;
    private Double amount;
    private Date paymentDate;
    private String paymentMethod;
    private String status;
    private String transactionId;
    private Long invoiceId;
    private Long subscriptionId;
} 