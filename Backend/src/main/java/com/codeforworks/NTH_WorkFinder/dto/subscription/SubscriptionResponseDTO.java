package com.codeforworks.NTH_WorkFinder.dto.subscription;

import lombok.Data;
import java.util.Date;

@Data
public class SubscriptionResponseDTO {
    private Long id;
    private Long employerId;
    private String packageName;
    private Long packageId;
    private Date startDate;
    private Date endDate;
    private Boolean isActive;
    private Long paymentId;
    private Long invoiceId;
}