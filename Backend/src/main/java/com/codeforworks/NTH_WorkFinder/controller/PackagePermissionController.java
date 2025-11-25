package com.codeforworks.NTH_WorkFinder.controller;

import com.codeforworks.NTH_WorkFinder.dto.apackage.PackagePermissionRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.apackage.PackagePermissionResponseDTO;
import com.codeforworks.NTH_WorkFinder.service.impl.PackagePermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/package-permissions")
@RequiredArgsConstructor
public class PackagePermissionController {
    private final PackagePermissionService packagePermissionService;

    //Gán quyền cho gói dịch vụ
    @PostMapping("/assign")
    public ResponseEntity<PackagePermissionResponseDTO> assignPermissionToPackage(
            @RequestBody PackagePermissionRequestDTO requestDTO) {
        return ResponseEntity.ok(packagePermissionService.assignPermissionToPackage(requestDTO));
    }

    //Lấy danh sách quyền theo id gói dịch vụ
    @GetMapping("/package/{packageId}")
    public ResponseEntity<List<PackagePermissionResponseDTO>> getPermissionsByPackageId(
            @PathVariable Long packageId) {
        return ResponseEntity.ok(packagePermissionService.getPermissionsByPackageId(packageId));
    }

    //Tắt quyền khỏi gói dịch vụ
    @PutMapping("/disable/{packageId}/permission/{permissionId}")
    public ResponseEntity<Void> disablePermissionForPackage(
            @PathVariable Long packageId,
            @PathVariable Long permissionId) {
        packagePermissionService.disablePermissionForPackage(packageId, permissionId);
        return ResponseEntity.ok().build();
    }

    //Bật quyền cho gói dịch vụ
    @PutMapping("/enable/{packageId}/permission/{permissionId}")
    public ResponseEntity<Void> enablePermissionForPackage(
            @PathVariable Long packageId,
            @PathVariable Long permissionId) {
        packagePermissionService.enablePermissionForPackage(packageId, permissionId);
        return ResponseEntity.ok().build();
    }

    //Xóa quyền khỏi gói dịch vụ
    @DeleteMapping("/package/{packageId}/permission/{permissionId}")
    public ResponseEntity<Void> deletePermissionFromPackage(
            @PathVariable Long packageId,
            @PathVariable Long permissionId) {
        packagePermissionService.deletePermissionFromPackage(packageId, permissionId);
        return ResponseEntity.ok().build();
    }
}
