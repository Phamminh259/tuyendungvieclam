package com.codeforworks.NTH_WorkFinder.mapper;

import com.codeforworks.NTH_WorkFinder.dto.candidate.CandidateSkillRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.candidate.CandidateSkillResponseDTO;
import com.codeforworks.NTH_WorkFinder.model.CandidateSkill;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CandidateSkillMapper {
    CandidateSkillMapper INSTANCE = Mappers.getMapper(CandidateSkillMapper.class);

    CandidateSkill toCandidateSkillEntity(CandidateSkillRequestDTO dto);

    @Mapping(target = "candidateId", source = "candidate.id")
    @Mapping(target = "skillId", source = "skill.id")
    @Mapping(target = "skillName", source = "skill.skillName")
    @Mapping(target = "proficiencyLevel", expression = "java(candidateSkill.getProficiencyLevel().name())")
    CandidateSkillResponseDTO toCandidateSkillResponseDTO(CandidateSkill candidateSkill);
}
