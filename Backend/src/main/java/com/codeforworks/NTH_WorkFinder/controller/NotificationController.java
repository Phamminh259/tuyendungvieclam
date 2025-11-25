package com.codeforworks.NTH_WorkFinder.controller;

import com.codeforworks.NTH_WorkFinder.dto.notification.NotificationResponseDTO;
import com.codeforworks.NTH_WorkFinder.service.INotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final INotificationService notificationService;

    // Lấy tất cả thông báo (ADMIN)
    @GetMapping
    public ResponseEntity<List<NotificationResponseDTO>> getAllNotifications() {
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    // Lấy thông báo theo người dùng (USER + EMPLOYER)
    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<NotificationResponseDTO>> getNotificationsByAccount(
            @PathVariable Long accountId,
            @RequestParam(defaultValue = "false") boolean unreadOnly) {
        return ResponseEntity.ok(notificationService.getNotificationsByAccount(accountId, unreadOnly));
    }

    // Đánh dấu đã đọc thông báo (USER + EMPLOYER)
    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    // Đánh dấu đã đọc tất cả thông báo (USER + EMPLOYER)
    @PutMapping("/account/{accountId}/read-all")
    public ResponseEntity<Void> markAllAsRead(@PathVariable Long accountId) {
        notificationService.markAllAsRead(accountId);
        return ResponseEntity.ok().build();
    }

    // Xóa thông báo (USER + EMPLOYER)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok().build();
    }

    // Lấy số lượng thông báo chưa đọc (USER + EMPLOYER)
    @GetMapping("/account/{accountId}/unread-count")
    public ResponseEntity<Long> getUnreadCount(@PathVariable Long accountId) {
        return ResponseEntity.ok(notificationService.getUnreadCount(accountId));
    }
} 