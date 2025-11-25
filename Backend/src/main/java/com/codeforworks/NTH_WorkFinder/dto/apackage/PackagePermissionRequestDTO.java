package com.codeforworks.NTH_WorkFinder.dto.apackage;

import lombok.Data;

@Data
public class PackagePermissionRequestDTO {
    private Long packageId;
    private Long permissionId;
    private String value; // Giá trị quyền (tùy chỉnh theo từng gói)
}