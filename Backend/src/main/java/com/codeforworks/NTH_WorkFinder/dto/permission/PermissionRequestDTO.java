package com.codeforworks.NTH_WorkFinder.dto.permission;

import lombok.Data;

@Data
public class PermissionRequestDTO {
    private String permissionKey;
    private String permissionName;
    private String description;
}