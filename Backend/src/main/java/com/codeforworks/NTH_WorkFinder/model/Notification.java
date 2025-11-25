package com.codeforworks.NTH_WorkFinder.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "notification")
public class Notification extends Base{

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;  // Người nhận thông báo

    @ManyToOne
    @JoinColumn(name = "id_user", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;     // Tiêu đề thông báo

    @Column(columnDefinition = "TEXT")
    private String content;   // Nội dung thông báo

    @Enumerated(EnumType.STRING)
    private NotificationType type;  // Loại thông báo

    private String link;      // Link liên quan (nếu có)
    
    private boolean isRead;   // Đã đọc chưa
    
    @Enumerated(EnumType.STRING)
    private NotificationStatus status;  // Trạng thái thông báo

    public enum NotificationType {
        APPLICATION_UPDATE,    // Cập nhật đơn ứng tuyển
        INTERVIEW_INVITATION, // Lời mời phỏng vấn
        JOB_MATCHING,        // Việc làm phù hợp
        SUBSCRIPTION_EXPIRY, // Sắp hết hạn gói
        PAYMENT_STATUS,      // Trạng thái thanh toán
        SYSTEM_NOTICE       // Thông báo hệ thống
    }

    public enum NotificationStatus {
        PENDING,   // Chờ gửi
        SENT,      // Đã gửi
        DELIVERED, // Đã nhận
        READ,      // Đã đọc
        FAILED     // Gửi thất bại
    }
}
