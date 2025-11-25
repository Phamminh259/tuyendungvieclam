package com.codeforworks.NTH_WorkFinder.dto.apackage;

import lombok.Data;
import java.util.Date;

@Data
public class PackagePermissionResponseDTO {
    private Long id;
    private String packageName;
    private String permissionName;
    private String value; // Giá trị quyền (tùy chỉnh theo từng gói)
    private Boolean isActive; // Trạng thái quyền
    private Date grantedDate; // Ngày cấp quyền
}
