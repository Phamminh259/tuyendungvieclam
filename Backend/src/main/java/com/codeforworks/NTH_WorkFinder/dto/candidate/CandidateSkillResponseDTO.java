package com.codeforworks.NTH_WorkFinder.dto.candidate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CandidateSkillResponseDTO {
    private Long id;
    private Long candidateId;
    private Long skillId;
    private String skillName;
    private String proficiencyLevel; 
}
