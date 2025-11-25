package com.codeforworks.NTH_WorkFinder.mapper;

import com.codeforworks.NTH_WorkFinder.dto.job.JobSkillRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.job.JobSkillResponseDTO;
import com.codeforworks.NTH_WorkFinder.model.JobSkill;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface JobSkillMapper {
    JobSkillMapper INSTANCE = Mappers.getMapper(JobSkillMapper.class);

    @Mapping(source = "job.id", target = "jobId")
    @Mapping(source = "job.title", target = "jobTitle") 
    @Mapping(source = "skill.skillName", target = "skillName")
    JobSkillResponseDTO toJobSkillResponseDTO(JobSkill jobSkill);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "job", ignore = true)
    @Mapping(target = "skill", ignore = true)
    JobSkill toJobSkillEntity(JobSkillRequestDTO jobSkillRequestDTO);
}
