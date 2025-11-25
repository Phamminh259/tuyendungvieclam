package com.codeforworks.NTH_WorkFinder.mapper;

import com.codeforworks.NTH_WorkFinder.dto.job.JobRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.job.JobResponseDTO;
import com.codeforworks.NTH_WorkFinder.dto.job.JobSkillResponseDTO;
import com.codeforworks.NTH_WorkFinder.model.Job;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import org.mapstruct.AfterMapping;
import org.mapstruct.MappingTarget;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface JobMapper {
    JobMapper INSTANCE = Mappers.getMapper(JobMapper.class);

    @Mapping(target = "employerName", expression = "java(job.getEmployer() != null ? job.getEmployer().getCompanyName() : null)")
    @Mapping(target = "professionName", expression = "java(job.getProfession() != null ? job.getProfession().getName() : null)")
    @Mapping(target = "industryName", expression = "java(job.getIndustry() != null ? job.getIndustry().getName() : null)")
    @Mapping(target = "companyName", expression = "java(job.getEmployer() != null ? job.getEmployer().getCompanyName() : null)")
    @Mapping(target = "companyLogo", expression = "java(job.getEmployer() != null ? job.getEmployer().getCompanyLogo() : null)")
    @Mapping(target = "companyId", expression = "java(job.getEmployer() != null ? job.getEmployer().getId() : null)")
    @Mapping(target = "isActive", source = "active")
    @Mapping(target = "approved", source = "approved")
    @Mapping(target = "isFeatured", source = "featured")
    @Mapping(target = "applicationCount", expression = "java(job.getApplications() != null ? (long) job.getApplications().size() : 0L)")
    @Mapping(source = "jobSkills", target = "skills")
    @Mapping(source = "requiredJobLevel", target = "requiredJobLevel")
    @Mapping(source = "requiredExperienceLevel", target = "requiredExperienceLevel")
    @Mapping(source = "requiredEducationLevel", target = "requiredEducationLevel")
    @Mapping(source = "requiredJobType", target = "requiredJobType")
    @Mapping(target = "contactEmail", expression = "java(job.getEmployer() != null ? job.getEmployer().getContactEmail() : null)")
    @Mapping(target = "companyPhone", expression = "java(job.getEmployer() != null ? job.getEmployer().getCompanyPhone() : null)")
    JobResponseDTO toJobResponseDTO(Job job);
    
    @AfterMapping
    default void mapSkills(Job job, @MappingTarget JobResponseDTO jobResponseDTO) {
        if (job.getJobSkills() != null) {
            List<JobSkillResponseDTO> skillDTOs = job.getJobSkills().stream()
                .map(jobSkill -> {
                    JobSkillResponseDTO dto = new JobSkillResponseDTO();
                    dto.setId(jobSkill.getId());
                    dto.setJobId(job.getId());
                    dto.setJobTitle(job.getTitle());
                    dto.setSkillName(jobSkill.getSkill().getSkillName());
                    dto.setProficiencyLevel(jobSkill.getProficiencyLevel() != null ? 
                        jobSkill.getProficiencyLevel().name() : null);
                    dto.setDescription(jobSkill.getDescription());
                    dto.setIsRequired(jobSkill.getIsRequired());
                    return dto;
                })
                .collect(Collectors.toList());
            jobResponseDTO.setSkills(skillDTOs);
        }
    }

    @AfterMapping
    default void mapEnums(Job job, @MappingTarget JobResponseDTO jobResponseDTO) {
        if (job.getRequiredJobLevel() != null) {
            jobResponseDTO.setRequiredJobLevel(job.getRequiredJobLevel().name());
        }
        if (job.getRequiredExperienceLevel() != null) {
            jobResponseDTO.setRequiredExperienceLevel(job.getRequiredExperienceLevel().name());
        }
        if (job.getRequiredEducationLevel() != null) {
            jobResponseDTO.setRequiredEducationLevel(job.getRequiredEducationLevel().name());
        }
        if (job.getRequiredJobType() != null) {
            jobResponseDTO.setRequiredJobType(job.getRequiredJobType().name());
        }
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "code", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "viewCount", ignore = true)
    @Mapping(target = "applications", ignore = true)
    @Mapping(target = "approved", ignore = true)
    Job toJobEntity(JobRequestDTO jobRequestDTO);
}