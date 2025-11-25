package com.codeforworks.NTH_WorkFinder.dto.candidate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CandidateSkillRequestDTO {
    private Long skillId;
    private String proficiencyLevel; // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
}
