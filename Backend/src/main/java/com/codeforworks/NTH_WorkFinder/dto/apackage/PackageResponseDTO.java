package com.codeforworks.NTH_WorkFinder.dto.apackage;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PackageResponseDTO {
    private Long id;
    private String packageName;
    private Integer duration;
    private Double price;
    private List<PackagePermissionResponseDTO> permissions;
}