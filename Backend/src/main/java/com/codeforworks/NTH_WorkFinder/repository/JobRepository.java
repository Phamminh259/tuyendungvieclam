package com.codeforworks.NTH_WorkFinder.repository;

import com.codeforworks.NTH_WorkFinder.model.Job;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {

    // --- Lấy job theo view count, mới nhất ---
    List<Job> findTopByOrderByViewCountDesc(Pageable pageable);
    List<Job> findByOrderByCreatedDateDesc(Pageable pageable);

    // --- Lấy job đã hết hạn ---
    List<Job> findByExpiryDateBeforeAndIsActiveTrue(Date date);

    // --- Lấy job theo employer ---
    List<Job> findByEmployerId(Long employerId);

    // --- Tìm kiếm theo keyword, location ---
    List<Job> findByTitleContainingIgnoreCase(String keyword);
    List<Job> findByLocationContainingIgnoreCase(String location);
    List<Job> findByDescriptionContainingIgnoreCase(String keyword);
    List<Job> findByTitleContainingIgnoreCaseAndLocationContainingIgnoreCase(String title, String location);

    // --- Job mới nhất ---
    List<Job> findTop50ByOrderByCreatedDateDesc();

    // --- Thống kê job theo subscription / featured ---
    int countByEmployerIdAndSubscriptionIdAndIsFeaturedFalse(Long employerId, Long subscriptionId);
    int countByEmployerIdAndSubscriptionIdAndIsFeaturedTrue(Long employerId, Long subscriptionId);

    @Query("SELECT COUNT(j) FROM Job j WHERE j.employer.id = :employerId AND j.isFeatured = false")
    int countByEmployerIdAndIsFeaturedFalse(@Param("employerId") Long employerId);

    // --- Lấy job còn hạn (để dùng trong RAG) ---
    @Query("SELECT j FROM Job j WHERE j.expiryDate IS NULL OR j.expiryDate >= CURRENT_DATE")
    List<Job> findActiveJobs();

    // --- Lấy job kèm employer name, skills, industry (dùng JOIN FETCH) ---
    @Query("""
        SELECT j FROM Job j
        LEFT JOIN FETCH j.employer e
        LEFT JOIN FETCH j.jobSkills js
        LEFT JOIN FETCH js.skill s
        LEFT JOIN FETCH j.industry i
        WHERE j.expiryDate IS NULL OR j.expiryDate >= CURRENT_DATE
    """)
    List<Job> findAllWithDetails();
    @Query("SELECT j FROM Job j LEFT JOIN FETCH j.jobSkills js LEFT JOIN FETCH js.skill")
    List<Job> findAllWithSkills();


}
