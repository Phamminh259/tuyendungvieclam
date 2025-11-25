package com.codeforworks.NTH_WorkFinder.mapper;

import com.codeforworks.NTH_WorkFinder.dto.skill.SkillRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.skill.SkillResponseDTO;
import com.codeforworks.NTH_WorkFinder.model.Skill;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface SkillMapper {
    SkillMapper INSTANCE = Mappers.getMapper(SkillMapper.class);

    Skill toSkillEntity(SkillRequestDTO dto);

    SkillResponseDTO toSkillResponseDTO(Skill skill);
}
