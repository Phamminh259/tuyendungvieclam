package com.codeforworks.NTH_WorkFinder.service;

import com.codeforworks.NTH_WorkFinder.dto.apackage.PackageRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.apackage.PackageResponseDTO;

import java.util.List;

public interface IPackageService {

    PackageResponseDTO createPackage(PackageRequestDTO packageRequestDTO);

    PackageResponseDTO getPackageById(Long id);

    List<PackageResponseDTO> getAllPackages();

    PackageResponseDTO updatePackage(Long id, PackageRequestDTO packageRequestDTO);

    void deletePackage(Long id);
}
