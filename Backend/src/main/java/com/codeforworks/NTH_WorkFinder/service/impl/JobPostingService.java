package com.codeforworks.NTH_WorkFinder.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.codeforworks.NTH_WorkFinder.model.PackagePermission;
import com.codeforworks.NTH_WorkFinder.model.Subscription;
import com.codeforworks.NTH_WorkFinder.repository.JobRepository;
import com.codeforworks.NTH_WorkFinder.repository.PackagePermissionRepository;
import com.codeforworks.NTH_WorkFinder.repository.SubscriptionRepository;
import com.codeforworks.NTH_WorkFinder.dto.job.JobPostingQuotaDTO;

import jakarta.transaction.Transactional;
import java.util.Optional;

@Service
@Transactional
public class JobPostingService {
    @Autowired
    private SubscriptionRepository subscriptionRepository;
    
    @Autowired
    private PackagePermissionRepository packagePermissionRepository;

    @Autowired
    private JobRepository jobRepository;

    // Kiểm tra xem nhà tuyển dụng có thể đăng tin thường không
    public boolean canPostNormalJob(Long employerId) {
        // Tìm subscription active
        Optional<Subscription> activeSubscriptionOpt = subscriptionRepository.findActiveSubscriptionByEmployerId(employerId);
        
        // Nếu không có gói active, kiểm tra số lượng tin free
        if (activeSubscriptionOpt.isEmpty()) {
            int usedFreeJobs = jobRepository.countByEmployerIdAndIsFeaturedFalse(employerId);
            return usedFreeJobs < 2; // Cho phép đăng 2 tin free
        }

        // Nếu có gói active, kiểm tra theo package permission
        Subscription activeSubscription = activeSubscriptionOpt.get();
        PackagePermission postJobPermission = packagePermissionRepository
                .findByPackageEntityIdAndPermission_PermissionKey(
                    activeSubscription.getPackageEntity().getId(), 
                    "POST_JOB"
                )
                .orElseThrow(() -> new RuntimeException("Không tìm thấy quyền đăng tin"));

        String value = postJobPermission.getValue();
        if ("unlimited".equalsIgnoreCase(value)) {
            return true;
        }
        
        int normalJobLimit = Integer.parseInt(value);
        int usedNormalJobs = countNormalJobsPosted(employerId, activeSubscription.getId());
        return usedNormalJobs < normalJobLimit;
    }

    // Kiểm tra xem nhà tuyển dụng có thể đăng tin nổi bật không
    public boolean canPostFeaturedJob(Long employerId) {
        Subscription activeSubscription = subscriptionRepository.findActiveSubscriptionByEmployerId(employerId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy gói đăng ký active"));

        PackagePermission pinJobPermission = packagePermissionRepository
                .findByPackageEntityIdAndPermission_PermissionKey(
                    activeSubscription.getPackageEntity().getId(), 
                    "PIN_JOB"
                )
                .orElseThrow(() -> new RuntimeException("Không tìm thấy quyền ghim tin"));

        int featuredJobLimit = Integer.parseInt(pinJobPermission.getValue());
        int usedFeaturedJobs = countFeaturedJobsPosted(employerId, activeSubscription.getId());

        return usedFeaturedJobs < featuredJobLimit;
    }

    // Đếm số lượng tin thường đã đăng
    private int countNormalJobsPosted(Long employerId, Long subscriptionId) {
        return jobRepository.countByEmployerIdAndSubscriptionIdAndIsFeaturedFalse(
            employerId, subscriptionId);
    }

    // Đếm số lượng tin nổi bật đã đăng
    private int countFeaturedJobsPosted(Long employerId, Long subscriptionId) {
        return jobRepository.countByEmployerIdAndSubscriptionIdAndIsFeaturedTrue(
            employerId, subscriptionId);
    }

    // Lấy giới hạn tin thường và tin nổi bật
    public JobPostingQuotaDTO getJobPostingQuota(Long employerId) {
        Optional<Subscription> activeSubscriptionOpt = subscriptionRepository.findActiveSubscriptionByEmployerId(employerId);
        
        // Nếu không có gói active, trả về quota free
        if (activeSubscriptionOpt.isEmpty()) {
            int usedFreeJobs = jobRepository.countByEmployerIdAndIsFeaturedFalse(employerId);
            return JobPostingQuotaDTO.builder()
                    .normalJobLimit(2)
                    .normalJobUsed(usedFreeJobs)
                    .normalJobRemaining(2 - usedFreeJobs)
                    .featuredJobLimit(0)
                    .featuredJobUsed(0)
                    .featuredJobRemaining(0)
                    .build();
        }

        // Xử lý như cũ nếu có gói active
        Subscription activeSubscription = activeSubscriptionOpt.get();
        PackagePermission normalJobPermission = packagePermissionRepository
                .findByPackageEntityIdAndPermission_PermissionKey(
                    activeSubscription.getPackageEntity().getId(), 
                    "POST_JOB"
                )
                .orElseThrow(() -> new RuntimeException("Không tìm thấy quyền đăng tin thường"));

        PackagePermission featuredJobPermission = packagePermissionRepository
                .findByPackageEntityIdAndPermission_PermissionKey(
                    activeSubscription.getPackageEntity().getId(), 
                    "PIN_JOB"
                )
                .orElseThrow(() -> new RuntimeException("Không tìm thấy quyền đăng tin nổi bật"));

        int usedNormalJobs = countNormalJobsPosted(employerId, activeSubscription.getId());
        int usedFeaturedJobs = countFeaturedJobsPosted(employerId, activeSubscription.getId());

        // Xử lý giới hạn tin thường
        int normalJobLimit;
        int normalJobRemaining;
        if ("unlimited".equalsIgnoreCase(normalJobPermission.getValue())) {
            normalJobLimit = -1; // -1 đại diện cho unlimited
            normalJobRemaining = -1;
        } else {
            normalJobLimit = Integer.parseInt(normalJobPermission.getValue());
            normalJobRemaining = normalJobLimit - usedNormalJobs;
        }

        // Xử lý giới hạn tin nổi bật
        int featuredJobLimit;
        int featuredJobRemaining;
        if ("unlimited".equalsIgnoreCase(featuredJobPermission.getValue())) {
            featuredJobLimit = -1;
            featuredJobRemaining = -1;
        } else {
            featuredJobLimit = Integer.parseInt(featuredJobPermission.getValue());
            featuredJobRemaining = featuredJobLimit - usedFeaturedJobs;
        }

        return JobPostingQuotaDTO.builder()
                .normalJobLimit(normalJobLimit)
                .normalJobUsed(usedNormalJobs)
                .normalJobRemaining(normalJobRemaining)
                .featuredJobLimit(featuredJobLimit)
                .featuredJobUsed(usedFeaturedJobs)
                .featuredJobRemaining(featuredJobRemaining)
                .build();
    }
}