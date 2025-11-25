package com.codeforworks.NTH_WorkFinder.service.impl;

import com.codeforworks.NTH_WorkFinder.dto.apackage.PackagePermissionRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.apackage.PackagePermissionResponseDTO;
import com.codeforworks.NTH_WorkFinder.exception.ResourceNotFoundException;
import com.codeforworks.NTH_WorkFinder.mapper.PackagePermissionMapper;
import com.codeforworks.NTH_WorkFinder.model.Package;
import com.codeforworks.NTH_WorkFinder.model.PackagePermission;
import com.codeforworks.NTH_WorkFinder.model.Permission;
import com.codeforworks.NTH_WorkFinder.repository.PackagePermissionRepository;
import com.codeforworks.NTH_WorkFinder.repository.PackageRepository;
import com.codeforworks.NTH_WorkFinder.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class PackagePermissionService {
    private final PackagePermissionRepository packagePermissionRepository;
    private final PackageRepository packageRepository;
    private final PermissionRepository permissionRepository;
    private final PackagePermissionMapper packagePermissionMapper;

    //Gán quyền cho gói dịch vụ
    public PackagePermissionResponseDTO assignPermissionToPackage(PackagePermissionRequestDTO requestDTO) {
        Package packageEntity = packageRepository.findById(requestDTO.getPackageId())
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy gói với id: " + requestDTO.getPackageId()));
            
        Permission permission = permissionRepository.findById(requestDTO.getPermissionId())
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy quyền với id: " + requestDTO.getPermissionId()));

        // Kiểm tra trạng thái active của permission
        if (!permission.isActive()) {
            throw new RuntimeException("Không thể gán quyền không hoạt động");
        }

        PackagePermission packagePermission = new PackagePermission();
        packagePermission.setPackageEntity(packageEntity);
        packagePermission.setPermission(permission);
        packagePermission.setValue(requestDTO.getValue());
        packagePermission.setGrantedDate(new Date());
        packagePermission.setIsActive(true);

        PackagePermission saved = packagePermissionRepository.save(packagePermission);
        return packagePermissionMapper.toDTO(saved);
    }

    //Lấy quyền theo id gói dịch vụ
    public List<PackagePermissionResponseDTO> getPermissionsByPackageId(Long packageId) {
        List<PackagePermission> permissions = packagePermissionRepository.findByPackageEntityId(packageId);
        return permissions.stream()
            .map(packagePermissionMapper::toDTO)
            .toList();
    }

    //Tắt quyền khỏi gói dịch vụ
    public void disablePermissionForPackage(Long packageId, Long permissionId) {
        PackagePermission packagePermission = packagePermissionRepository
            .findByPackageEntityIdAndPermissionId(packageId, permissionId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy quyền trong gói"));
            
        packagePermission.setIsActive(false);
        packagePermissionRepository.save(packagePermission);
    }

    //Bật quyền cho gói dịch vụ
    public void enablePermissionForPackage(Long packageId, Long permissionId) {
        PackagePermission packagePermission = packagePermissionRepository
            .findByPackageEntityIdAndPermissionId(packageId, permissionId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy quyền trong gói"));
        packagePermission.setIsActive(true);
        packagePermissionRepository.save(packagePermission);
    }

    //Xóa quyền khỏi gói dịch vụ
    public void deletePermissionFromPackage(Long packageId, Long permissionId) {
        packagePermissionRepository.deleteByPackageEntityIdAndPermissionId(packageId, permissionId);
    }
}
