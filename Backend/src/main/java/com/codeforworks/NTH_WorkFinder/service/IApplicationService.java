package com.codeforworks.NTH_WorkFinder.service;

import com.codeforworks.NTH_WorkFinder.dto.application.ApplicationRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.application.ApplicationResponseDTO;
import com.codeforworks.NTH_WorkFinder.dto.candidate.CandidateProfileDTO;

import java.util.List;

public interface IApplicationService {

    ApplicationResponseDTO getApplicationById(Long id);

    List<ApplicationResponseDTO> getAllApplications();

    ApplicationResponseDTO createApplication(ApplicationRequestDTO applicationRequestDTO);

    ApplicationResponseDTO updateApplicationStatus(Long id, String status);

    void deleteApplication(Long id);

    List<ApplicationResponseDTO> getApplicationsByJobId(Long jobId);

    List<ApplicationResponseDTO> getApplicationsByCandidateId(Long candidateId);

   public List<CandidateProfileDTO> getCandidatesByEmployerId(Long employerId);

   public List<CandidateProfileDTO> getAcceptedCandidatesByEmployerId(Long employerId);
}
