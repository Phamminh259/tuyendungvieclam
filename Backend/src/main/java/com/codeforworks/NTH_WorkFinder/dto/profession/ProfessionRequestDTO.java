package com.codeforworks.NTH_WorkFinder.dto.profession;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfessionRequestDTO {
    private String name;
    private String description;
    private Long industryId;
}