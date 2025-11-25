package com.codeforworks.NTH_WorkFinder.mapper;

import com.codeforworks.NTH_WorkFinder.dto.candidate.CandidateProfileDTO;
import com.codeforworks.NTH_WorkFinder.dto.candidate.CandidateRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.candidate.CandidateResponseDTO;
import com.codeforworks.NTH_WorkFinder.dto.candidate.WorkHistoryDTO;
import com.codeforworks.NTH_WorkFinder.model.Candidate;
import com.codeforworks.NTH_WorkFinder.model.WorkHistory;
import com.codeforworks.NTH_WorkFinder.mapper.CandidateSkillMapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", uses = {CandidateSkillMapper.class})
public interface CandidateMapper {
    @Autowired
    CandidateSkillMapper candidateSkillMapper = Mappers.getMapper(CandidateSkillMapper.class);

    CandidateMapper INSTANCE = Mappers.getMapper(CandidateMapper.class);

    @Mapping(target = "fullName", source = "user.fullName")
    @Mapping(target = "email", source = "user.account.email")
    @Mapping(target = "professionName", source = "profession.name")
    @Mapping(target = "industryName", source = "industry.name")
    @Mapping(target = "isAvailable", expression = "java(candidate.getIsAvailable() != null ? candidate.getIsAvailable() : false)")
    @Mapping(target = "candidateSkills", expression = "java(candidate.getCandidateSkills().stream().map(candidateSkillMapper::toCandidateSkillResponseDTO).collect(java.util.stream.Collectors.toList()))")
    CandidateProfileDTO toCandidateProfileDTO(Candidate candidate);

    Candidate toCandidateEntity(CandidateRequestDTO candidateRequestDTO);

    @Mapping(target = "id", source = "workHistory.id") // Ánh xạ id
    @Mapping(target = "candidateId", expression = "java(workHistory.getCandidate().getId())") // Ánh xạ candidateId
    WorkHistoryDTO toWorkHistoryDTO(WorkHistory workHistory);

    WorkHistory toWorkHistory(WorkHistoryDTO workHistoryDTO);
}