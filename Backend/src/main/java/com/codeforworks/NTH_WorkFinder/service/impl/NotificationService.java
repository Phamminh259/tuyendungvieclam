package com.codeforworks.NTH_WorkFinder.service.impl;


import com.codeforworks.NTH_WorkFinder.dto.notification.NotificationResponseDTO;
import com.codeforworks.NTH_WorkFinder.exception.ResourceNotFoundException;
import com.codeforworks.NTH_WorkFinder.mapper.NotificationMapper;
import com.codeforworks.NTH_WorkFinder.model.Account;
import com.codeforworks.NTH_WorkFinder.model.Notification;
import com.codeforworks.NTH_WorkFinder.repository.AccountRepository;
import com.codeforworks.NTH_WorkFinder.repository.NotificationRepository;
import com.codeforworks.NTH_WorkFinder.service.INotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class NotificationService implements INotificationService {
    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    private final AccountRepository accountRepository;

    @Override
    public List<NotificationResponseDTO> getAllNotifications() {
        return notificationRepository.findAll().stream()
            .map(notificationMapper::toDTO)
            .toList();
    }

    @Override
    public List<NotificationResponseDTO> getNotificationsByAccount(Long accountId, boolean unreadOnly) {
        List<Notification> notifications = unreadOnly ?
            notificationRepository.findByAccount_IdAndIsReadFalseOrderByCreatedDateDesc(accountId) :
            notificationRepository.findByAccount_IdOrderByCreatedDateDesc(accountId);
        return notifications.stream()
            .map(notificationMapper::toDTO)
            .toList();
    }

    @Override
    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông báo"));
        notification.setRead(true);
        notification.setStatus(Notification.NotificationStatus.READ);
        notificationRepository.save(notification);
    }

    @Override
    public void markAllAsRead(Long accountId) {
        List<Notification> unreadNotifications = 
            notificationRepository.findByAccount_IdAndIsReadFalse(accountId);
        unreadNotifications.forEach(notification -> {
            notification.setRead(true);
            notification.setStatus(Notification.NotificationStatus.READ);
        });
        notificationRepository.saveAll(unreadNotifications);
    }

    @Override
    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }

    @Override
    public long getUnreadCount(Long accountId) {
        return notificationRepository.countByAccount_IdAndIsReadFalse(accountId);
    }

    // Phương thức tạo thông báo mới
    public void createNotification(Long accountId, String title, String content,
                                   Notification.NotificationType type, String link) {
        Notification notification = new Notification();
        
        // Lấy account
        Account account = accountRepository.getReferenceById(accountId);
        notification.setAccount(account);
        
        // Set user từ account
        notification.setUser(account.getUser());
        
        notification.setTitle(title);
        notification.setContent(content);
        notification.setType(type);
        notification.setLink(link);
        notification.setRead(false);
        notification.setStatus(Notification.NotificationStatus.PENDING);
        notificationRepository.save(notification);
    }
} 