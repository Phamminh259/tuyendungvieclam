package com.codeforworks.NTH_WorkFinder.dto.profession;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfessionResponseDTO {
    private Long id;
    private String name;
    private String description;
    private String industryName;
}