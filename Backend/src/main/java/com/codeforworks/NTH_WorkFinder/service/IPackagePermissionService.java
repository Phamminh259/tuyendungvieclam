package com.codeforworks.NTH_WorkFinder.service;

import com.codeforworks.NTH_WorkFinder.dto.apackage.PackagePermissionRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.apackage.PackagePermissionResponseDTO;

import java.util.List;

public interface IPackagePermissionService {

    PackagePermissionResponseDTO createPackagePermission(PackagePermissionRequestDTO packagePermissionRequestDTO);

    PackagePermissionResponseDTO updatePackagePermission(Long id, PackagePermissionRequestDTO packagePermissionRequestDTO);

    void removePermissionFromPackage(Long packagePermissionId);

    List<PackagePermissionResponseDTO> getPermissionsByPackageId(Long packageId);
}