package com.codeforworks.NTH_WorkFinder.service;

import com.codeforworks.NTH_WorkFinder.dto.permission.PermissionRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.permission.PermissionResponseDTO;

import java.util.List;

//PermissionService để quản lý các quyền trong hệ thống.
public interface IPermissionService {

    PermissionResponseDTO createPermission(PermissionRequestDTO permissionRequestDTO);

    PermissionResponseDTO getPermissionById(Long id);

    List<PermissionResponseDTO> getAllPermissions();

    PermissionResponseDTO updatePermission(Long id, PermissionRequestDTO permissionRequestDTO);

    void disablePermission(Long id);

    void enablePermission(Long id);

    void deletePermission(Long id);
}
