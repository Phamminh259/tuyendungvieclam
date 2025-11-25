package com.codeforworks.NTH_WorkFinder.dto.apackage;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PackageRequestDTO {
    @NotBlank
    private String packageName;
    
    @Min(1)
    private Integer duration;
    
    @Min(0)
    private Double price;
}
