package com.codeforworks.NTH_WorkFinder.repository;

import com.codeforworks.NTH_WorkFinder.model.JobSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobSkillRepository extends JpaRepository<JobSkill, Long> {
    List<JobSkill> findByJobId(Long jobId);
    List<JobSkill> findByJobIdAndIsRequiredTrue(Long jobId);
    List<JobSkill> findByJobIdAndProficiencyLevel(Long jobId, JobSkill.ProficiencyLevel proficiencyLevel);
    boolean existsByJobIdAndSkillId(Long jobId, Long skillId);
    @Modifying
    @Query("DELETE FROM JobSkill js WHERE js.job.id = :jobId")
    void deleteByJobId(@Param("jobId") Long jobId);
}
