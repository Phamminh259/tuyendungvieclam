package com.codeforworks.NTH_WorkFinder.mapper;

import com.codeforworks.NTH_WorkFinder.dto.apackage.PackageRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.apackage.PackageResponseDTO;
import com.codeforworks.NTH_WorkFinder.model.Package;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {PackagePermissionMapper.class})
public interface PackageMapper {
    Package toEntity(PackageRequestDTO dto);

    @Mapping(source = "packagePermissions", target = "permissions")
    PackageResponseDTO toDTO(Package entity);
}