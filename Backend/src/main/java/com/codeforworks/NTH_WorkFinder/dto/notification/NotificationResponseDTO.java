package com.codeforworks.NTH_WorkFinder.dto.notification;
import lombok.Data;

import java.util.Date;

@Data
public class NotificationResponseDTO {
    private Long id;
    private String title;
    private String content;
    private String type;
    private String link;
    private boolean isRead;
    private String status;
    private Date createdDate;
} 