package com.codeforworks.NTH_WorkFinder.dto.invoice;

import lombok.Data;
import java.util.Date;

@Data
public class InvoiceResponseDTO {
    private Long id;
    private String code;
    private String invoiceNumber;
    private Double amount;
    private Date issueDate;
    private String status;
    private String description;
    private String note;
    private Long subscriptionId;
} 