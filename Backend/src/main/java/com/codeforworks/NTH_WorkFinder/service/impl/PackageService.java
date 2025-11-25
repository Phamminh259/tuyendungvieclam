package com.codeforworks.NTH_WorkFinder.service.impl;

import com.codeforworks.NTH_WorkFinder.dto.apackage.PackageRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.apackage.PackageResponseDTO;
import com.codeforworks.NTH_WorkFinder.exception.ResourceNotFoundException;
import com.codeforworks.NTH_WorkFinder.mapper.PackageMapper;
import com.codeforworks.NTH_WorkFinder.model.Package;
import com.codeforworks.NTH_WorkFinder.repository.PackageRepository;
import com.codeforworks.NTH_WorkFinder.service.IPackageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PackageService implements IPackageService {

    private static final Logger logger = LoggerFactory.getLogger(PackageService.class);

    private final PackageRepository packageRepository;
    private final PackageMapper packageMapper;

    //Tạo gói dịch vụ
    @Override
    @Transactional
    public PackageResponseDTO createPackage(PackageRequestDTO packageRequestDTO) {
        logger.info("Tạo gói dịch vụ mới: {}", packageRequestDTO.getPackageName());
        validatePackageRequest(packageRequestDTO);
        
        // Kiểm tra tên gói đã tồn tại chưa
        if (packageRepository.existsByPackageName(packageRequestDTO.getPackageName())) {
            throw new IllegalArgumentException("Tên gói dịch vụ đã tồn tại");
        }
        
        Package aPackage = packageMapper.toEntity(packageRequestDTO);
        Package savedPackage = packageRepository.save(aPackage);
        logger.info("Gói dịch vụ được tạo thành công với id: {}", savedPackage.getId());
        return packageMapper.toDTO(savedPackage);
    }

    //Validate gói dịch vụ
    private void validatePackageRequest(PackageRequestDTO dto) {
        if (dto.getPackageName() == null || dto.getPackageName().trim().isEmpty()) {
            throw new IllegalArgumentException("Tên gói dịch vụ không được để trống");
        }
        if (dto.getPrice() == null || dto.getPrice() < 0) {
            throw new IllegalArgumentException("Giá phải là số dương");
        }
        if (dto.getDuration() == null || dto.getDuration() <= 0) {
            throw new IllegalArgumentException("Thời gian phải là số dương");
        }
    }

    //Lấy gói dịch vụ theo id
    @Override
    public PackageResponseDTO getPackageById(Long id) {
        Package aPackage = packageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gói dịch vụ không tồn tại với id: " + id));
        return packageMapper.toDTO(aPackage);
    }

    //Lấy tất cả gói dịch vụ
    @Override
    public List<PackageResponseDTO> getAllPackages() {
        List<Package> packages = packageRepository.findAll();
        return packages.stream()
                .map(packageMapper::toDTO)
                .collect(Collectors.toList());
    }

    //Cập nhật gói dịch vụ
    @Override
    @Transactional
    public PackageResponseDTO updatePackage(Long id, PackageRequestDTO packageRequestDTO) {
        Package aPackage = packageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gói dịch vụ không tồn tại với id: " + id));

        // Kiểm tra nếu tên mới khác tên cũ và đã tồn tại
        if (!aPackage.getPackageName().equals(packageRequestDTO.getPackageName()) && 
            packageRepository.existsByPackageName(packageRequestDTO.getPackageName())) {
            throw new IllegalArgumentException("Tên gói dịch vụ đã tồn tại");
        }

        aPackage.setPackageName(packageRequestDTO.getPackageName());
        aPackage.setDuration(packageRequestDTO.getDuration());
        aPackage.setPrice(packageRequestDTO.getPrice());

        Package updatedPackage = packageRepository.save(aPackage);
        return packageMapper.toDTO(updatedPackage);
    }

    @Override
    public void deletePackage(Long id) {
        if (!packageRepository.existsById(id)) {
            throw new ResourceNotFoundException("Gói dịch vụ không tồn tại với id: " + id);
        }
        packageRepository.deleteById(id);
    }
}
