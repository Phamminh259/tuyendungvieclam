package com.codeforworks.NTH_WorkFinder.service;

import com.codeforworks.NTH_WorkFinder.dto.subscription.SubscriptionRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.subscription.SubscriptionResponseDTO;

import java.util.List;

public interface ISubscriptionService {

    // Đăng ký gói dịch vụ (EMPLOYER)
    SubscriptionResponseDTO createSubscription(SubscriptionRequestDTO subscriptionRequestDTO);

    // Lấy chi tiết gói dịch vụ theo id (EMPLOYER)
    SubscriptionResponseDTO getSubscriptionById(Long id);

    // Lấy danh sách gói dịch vụ theo employer (EMPLOYER + ADMIN)
    List<SubscriptionResponseDTO> getSubscriptionsByEmployerId(Long employerId);

    // Lấy danh sách gói dịch vụ theo employer đã thanh toán (EMPLOYER + ADMIN)
    List<SubscriptionResponseDTO> getSubscriptionsByEmployerIdAndIsActiveTrue(Long employerId);

    // Lấy danh sách tất cả subscription (ADMIN)
    List<SubscriptionResponseDTO> getAllSubscriptions();

    // Lấy danh sách tất cả subscription đã thanh toán (ADMIN)
    List<SubscriptionResponseDTO> getAllSubscriptionsByIsActiveTrue();

    // Lấy subscription hiện tại của employer (EMPLOYER)
    SubscriptionResponseDTO getCurrentSubscription(Long employerId);
    
    // Hủy subscription (EMPLOYER)
    void cancelSubscription(Long id);

    // Kiểm tra subscription có hoạt động không (EMPLOYER)
    boolean isSubscriptionActive(Long employerId);

    // Gia hạn subscription (EMPLOYER)
    SubscriptionResponseDTO renewSubscription(Long id, Integer duration);
}
