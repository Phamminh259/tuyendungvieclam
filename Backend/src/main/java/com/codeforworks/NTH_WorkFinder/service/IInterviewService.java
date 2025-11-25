package com.codeforworks.NTH_WorkFinder.service;

import com.codeforworks.NTH_WorkFinder.dto.interview.InterviewRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.interview.InterviewResponseDTO;
import java.util.List;

public interface IInterviewService {
    InterviewResponseDTO createInterview(InterviewRequestDTO requestDTO);
    InterviewResponseDTO getInterviewById(Long id);
    List<InterviewResponseDTO> getInterviewsByApplication(Long applicationId);
    List<InterviewResponseDTO> getInterviewsByEmployer(Long employerId);
    List<InterviewResponseDTO> getInterviewsByCandidate(Long candidateId);
    void updateInterviewStatus(Long id, String status);
    void cancelInterview(Long id);
    InterviewResponseDTO updateInterview(Long applicationId, InterviewRequestDTO requestDTO);
} 