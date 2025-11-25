package com.codeforworks.NTH_WorkFinder.repository;

import com.codeforworks.NTH_WorkFinder.model.Employer;
import com.codeforworks.NTH_WorkFinder.model.Package;
import com.codeforworks.NTH_WorkFinder.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    boolean existsByEmployerAndPackageEntity(Employer employer, Package packageEntity);
    List<Subscription> findByEmployerId(Long employerId);
    boolean existsByEmployerIdAndIsActiveTrueAndEndDateAfter(Long employerId, Date date);
    List<Subscription> findByEmployerIdAndIsActiveTrue(Long employerId);
    List<Subscription> findByIsActiveTrue();
    @Query("SELECT s FROM Subscription s WHERE s.employer.id = :employerId AND s.isActive = true " +
           "ORDER BY s.createdDate DESC LIMIT 1")
    Optional<Subscription> findActiveSubscriptionByEmployerId(@Param("employerId") Long employerId);
}
