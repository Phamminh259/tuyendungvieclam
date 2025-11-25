package com.codeforworks.NTH_WorkFinder.repository;

import com.codeforworks.NTH_WorkFinder.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByAccount_IdOrderByCreatedDateDesc(Long accountId);
    List<Notification> findByAccount_IdAndIsReadFalseOrderByCreatedDateDesc(Long accountId);
    List<Notification> findByAccount_IdAndIsReadFalse(Long accountId);
    long countByAccount_IdAndIsReadFalse(Long accountId);
}