package com.codeforworks.NTH_WorkFinder.dto.permission;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PermissionResponseDTO {
    private Long id;
    private String permissionName;
    private String description;
    private String permissionKey;
    private boolean isActive;
}