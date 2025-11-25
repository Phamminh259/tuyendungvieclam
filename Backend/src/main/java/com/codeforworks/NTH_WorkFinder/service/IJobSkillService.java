package com.codeforworks.NTH_WorkFinder.service;

import com.codeforworks.NTH_WorkFinder.dto.job.JobSkillRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.job.JobSkillResponseDTO;

import java.util.List;

public interface IJobSkillService {

    JobSkillResponseDTO createJobSkill(JobSkillRequestDTO jobSkillRequestDTO);

    List<JobSkillResponseDTO> getJobSkillsByJobId(Long jobId);

    JobSkillResponseDTO updateJobSkill(Long id, JobSkillRequestDTO jobSkillRequestDTO);

    void deleteJobSkill(Long id);

    List<JobSkillResponseDTO> createMultipleJobSkills(Long jobId, List<JobSkillRequestDTO> skillRequests);

    List<JobSkillResponseDTO> getRequiredJobSkills(Long jobId);

    List<JobSkillResponseDTO> getJobSkillsByProficiencyLevel(Long jobId, String proficiencyLevel);
}
