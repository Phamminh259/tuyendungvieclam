package com.codeforworks.NTH_WorkFinder.repository;

import com.codeforworks.NTH_WorkFinder.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {

    List<Interview> findByApplication_Id(Long applicationId);
    List<Interview> findByApplication_Job_Employer_Id(Long employerId);
    List<Interview> findByApplication_Candidate_Id(Long candidateId);
    Optional<Interview> findFirstByApplication_IdOrderByCreatedDateDesc(Long applicationId);
}
