package com.codeforworks.NTH_WorkFinder.mapper;

import com.codeforworks.NTH_WorkFinder.dto.apackage.PackagePermissionResponseDTO;
import com.codeforworks.NTH_WorkFinder.model.PackagePermission;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PackagePermissionMapper {
    @Mapping(source = "packageEntity.packageName", target = "packageName")
    @Mapping(source = "permission.permissionName", target = "permissionName")
    PackagePermissionResponseDTO toDTO(PackagePermission entity);
}
