package com.codeforworks.NTH_WorkFinder.repository;

import com.codeforworks.NTH_WorkFinder.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByJobId(Long jobId);
    List<Application> findByCandidateId(Long candidateId);
    List<Application> findByStatus(Application.ApplicationStatus status);
    boolean existsByJobIdAndCandidateId(Long jobId, Long candidateId);
    @Query("SELECT a FROM Application a WHERE a.job.employer.id = :employerId")
    List<Application> findByJob_Employer_Id(Long employerId);
    @Query("SELECT a FROM Application a WHERE a.job.employer.id = :employerId AND a.status = :status")
    List<Application> findByJob_Employer_IdAndStatus(Long employerId, Application.ApplicationStatus status);
    @Modifying
    @Query("DELETE FROM Application a WHERE a.job.id = :jobId")
    void deleteByJobId(@Param("jobId") Long jobId);
}
