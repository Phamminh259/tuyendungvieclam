package com.codeforworks.NTH_WorkFinder.mapper;

import com.codeforworks.NTH_WorkFinder.dto.permission.PermissionRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.permission.PermissionResponseDTO;
import com.codeforworks.NTH_WorkFinder.model.Permission;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toEntity(PermissionRequestDTO dto);
    PermissionResponseDTO toDTO(Permission entity);
}