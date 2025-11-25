package com.codeforworks.NTH_WorkFinder.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminPaymentHistoryDTO {
    private Long paymentId;
    private String companyName;
    private String packageName;
    private Double amount;
    private Date paymentDate;
    private Date startDate;
    private Date endDate;
    private String paymentMethod;
    private String paymentStatus;
    private String invoiceNumber;
    private String transactionId;
    private String invoiceStatus;
} 