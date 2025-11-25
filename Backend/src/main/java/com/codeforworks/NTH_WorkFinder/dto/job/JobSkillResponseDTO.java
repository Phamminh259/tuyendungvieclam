package com.codeforworks.NTH_WorkFinder.dto.job;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JobSkillResponseDTO {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String skillName;
    private String proficiencyLevel;
    private String description;
    private Boolean isRequired; 
}
