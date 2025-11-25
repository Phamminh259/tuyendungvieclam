package com.codeforworks.NTH_WorkFinder.controller;

import com.codeforworks.NTH_WorkFinder.dto.apackage.PackageRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.apackage.PackageResponseDTO;
import com.codeforworks.NTH_WorkFinder.service.IPackageService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/packages")
@RequiredArgsConstructor
public class PackageController {

    private final IPackageService packageService;

    //Tạo gói dịch vụ
    @PostMapping
    public ResponseEntity<PackageResponseDTO> createPackage(@RequestBody PackageRequestDTO packageRequestDTO) {
        PackageResponseDTO createdPackage = packageService.createPackage(packageRequestDTO);
        return ResponseEntity.ok(createdPackage);
    }

    //Lấy gói dịch vụ theo id
    @GetMapping("/get-by/{id}")
    public ResponseEntity<PackageResponseDTO> getPackageById(@PathVariable Long id) {
        PackageResponseDTO aPackage = packageService.getPackageById(id);
        return ResponseEntity.ok(aPackage);
    }

    //Lấy tất cả gói dịch vụ
    @GetMapping("/list")
    public ResponseEntity<List<PackageResponseDTO>> getAllPackages() {
        List<PackageResponseDTO> packages = packageService.getAllPackages();
        return ResponseEntity.ok(packages);
    }

    //Cập nhật gói dịch vụ
    @PutMapping("/{id}")
    public ResponseEntity<PackageResponseDTO> updatePackage(@PathVariable Long id, @RequestBody PackageRequestDTO packageRequestDTO) {
        PackageResponseDTO updatedPackage = packageService.updatePackage(id, packageRequestDTO);
        return ResponseEntity.ok(updatedPackage);
    }

    //Xóa gói dịch vụ
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePackage(@PathVariable Long id) {
        packageService.deletePackage(id);
        return ResponseEntity.noContent().build();
    }
}
