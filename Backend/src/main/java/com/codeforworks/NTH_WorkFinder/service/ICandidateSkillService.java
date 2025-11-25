package com.codeforworks.NTH_WorkFinder.service;

import com.codeforworks.NTH_WorkFinder.dto.candidate.CandidateProfileDTO;
import com.codeforworks.NTH_WorkFinder.dto.candidate.CandidateSkillRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.candidate.CandidateSkillResponseDTO;

import java.util.List;

public interface ICandidateSkillService {

    CandidateProfileDTO addSkillToCandidate(Long candidateId, CandidateSkillRequestDTO candidateSkillRequestDTO);

    List<CandidateSkillResponseDTO> getCandidateSkillsByCandidateId(Long candidateId);

    void removeSkillFromCandidate(Long candidateId, Long skillId);

    CandidateSkillResponseDTO updateProficiencyLevel(Long candidateId, Long skillId, String newLevel);

    void deleteCandidateSkill(Long candidateSkillId);
}
