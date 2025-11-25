package com.codeforworks.NTH_WorkFinder.service;

import com.codeforworks.NTH_WorkFinder.dto.job.JobRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.job.JobResponseDTO;

import java.util.List;

public interface IJobService {

    JobResponseDTO getJobById(Long id);

    List<JobResponseDTO> getAllJobs();

    List<JobResponseDTO> getJobsByEmployerId(Long employerId);

    JobResponseDTO createJob(JobRequestDTO jobRequest);

    JobResponseDTO updateJob(Long id, JobRequestDTO jobRequestDTO);

    void deleteJob(Long id);

    List<JobResponseDTO> getTopViewedJobs(int limit);

    List<JobResponseDTO> getRecentJobs(int limit);

    JobResponseDTO approveJob(Long id);

    JobResponseDTO rejectJob(Long id);

    void incrementApplicationCount(Long jobId);
}
