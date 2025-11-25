package com.codeforworks.NTH_WorkFinder.service;

import com.codeforworks.NTH_WorkFinder.dto.candidate.*;
import com.codeforworks.NTH_WorkFinder.dto.job.JobResponseDTO;

import java.util.List;

public interface ICandidateService {

    CandidateProfileDTO getCandidateProfileById(Long id);

    CandidateProfileDTO getCandidateProfileByEmail(String email);

    List<CandidateProfileDTO> getAllCandidates();

    CandidateProfileDTO updateCandidate(Long id, CandidateRequestDTO candidateRequestDTO);

    void deleteCandidate(Long id);

    void updateAvailability(Long id, Boolean isAvailable);

    CandidateProfileDTO addWorkHistory(Long id, WorkHistoryDTO workHistoryDTO);

    WorkHistoryDTO getWorkHistoryById(Long candidateId, Long workHistoryId);
    
    WorkHistoryDTO updateWorkHistory(Long candidateId, Long workHistoryId, WorkHistoryDTO workHistoryDTO);
    
    void deleteWorkHistory(Long candidateId, Long workHistoryId);
    
    List<WorkHistoryDTO> getAllWorkHistories(Long candidateId);

    void sendJobSuggestionsToCandidate(Long candidateId);

    void saveJob(Long candidateId, Long jobId);

    List<JobResponseDTO> getSavedJobs(Long candidateId);

    void unsaveJob(Long candidateId, Long jobId);
}
