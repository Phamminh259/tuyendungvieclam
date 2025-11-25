package com.codeforworks.NTH_WorkFinder.service;

import com.codeforworks.NTH_WorkFinder.dto.notification.NotificationResponseDTO;
import com.codeforworks.NTH_WorkFinder.model.Notification.NotificationType;

import java.util.List;

public interface INotificationService {

    List<NotificationResponseDTO> getAllNotifications();

    List<NotificationResponseDTO> getNotificationsByAccount(Long accountId, boolean unreadOnly);

    void markAsRead(Long id);

    void markAllAsRead(Long accountId);

    void deleteNotification(Long id);

    long getUnreadCount(Long accountId);

    void createNotification(Long accountId, String title, String content, 
            NotificationType type, String link);
}
