package com.codeforworks.NTH_WorkFinder.service;

import com.codeforworks.NTH_WorkFinder.dto.employer.EmployerRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.employer.EmployerResponseDTO;
import com.codeforworks.NTH_WorkFinder.dto.employer.EmployerStatisticsDTO;
import com.codeforworks.NTH_WorkFinder.dto.job.JobResponseDTO;
import com.codeforworks.NTH_WorkFinder.dto.subscription.SubscriptionResponseDTO;
import com.codeforworks.NTH_WorkFinder.model.Employer;

import java.util.List;

public interface IEmployerService {

    EmployerResponseDTO getEmployerById(Long id);

    EmployerResponseDTO getEmployerByEmail(String email);

    List<EmployerResponseDTO> getAllEmployers();

    EmployerResponseDTO updateEmployer(Long id, EmployerRequestDTO employerRequestDTO);

    void deleteEmployer(Long id);

    List<SubscriptionResponseDTO> getEmployerSubscriptions(Long employerId);

    List<EmployerResponseDTO> searchEmployers(String keyword, String location, Long industryId);

    List<JobResponseDTO> getEmployerJobs(Long employerId);

    EmployerStatisticsDTO getEmployerStatistics(Long employerId);

    Employer approveEmployer(Long employerId);

    Employer suspendEmployer(Long employerId);
}
