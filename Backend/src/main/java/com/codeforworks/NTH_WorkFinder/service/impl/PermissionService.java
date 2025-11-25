package com.codeforworks.NTH_WorkFinder.service.impl;

import com.codeforworks.NTH_WorkFinder.dto.permission.PermissionRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.permission.PermissionResponseDTO;
import com.codeforworks.NTH_WorkFinder.exception.ResourceNotFoundException;
import com.codeforworks.NTH_WorkFinder.mapper.PermissionMapper;
import com.codeforworks.NTH_WorkFinder.model.Permission;
import com.codeforworks.NTH_WorkFinder.repository.PermissionRepository;
import com.codeforworks.NTH_WorkFinder.service.IPermissionService;

import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class PermissionService implements IPermissionService {
@Autowired
    private final PermissionRepository permissionRepository;
    private final PermissionMapper permissionMapper;
    private static final Logger logger = LoggerFactory.getLogger(PermissionService.class);


    @Override
    public PermissionResponseDTO createPermission(PermissionRequestDTO requestDTO) {
        if (permissionRepository.existsByPermissionKey(requestDTO.getPermissionKey())) {
            throw new IllegalArgumentException("Permission key đã tồn tại");
        }

        Permission permission = permissionMapper.toEntity(requestDTO);
        permission.setActive(true);
        Permission savedPermission = permissionRepository.save(permission);
        
        logger.info("Tạo mới permission: {}", savedPermission.getPermissionKey());
        return permissionMapper.toDTO(savedPermission);
    }

    @Override
    public PermissionResponseDTO getPermissionById(Long id) {
        Permission permission = permissionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy permission với id: " + id));
        return permissionMapper.toDTO(permission);
    }

    @Override
    public List<PermissionResponseDTO> getAllPermissions() {
        return permissionRepository.findAll().stream()
            .map(permissionMapper::toDTO)
            .collect(Collectors.toList());
    }

    @Override
    public PermissionResponseDTO updatePermission(Long id, PermissionRequestDTO requestDTO) {
        Permission permission = permissionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy permission với id: " + id));

        if (!permission.getPermissionKey().equals(requestDTO.getPermissionKey()) &&
            permissionRepository.existsByPermissionKey(requestDTO.getPermissionKey())) {
            throw new IllegalArgumentException("Permission key đã tồn tại");
        }

        permission.setPermissionName(requestDTO.getPermissionName());
        permission.setDescription(requestDTO.getDescription());
        permission.setPermissionKey(requestDTO.getPermissionKey());
        
        Permission updatedPermission = permissionRepository.save(permission);
        logger.info("Cập nhật permission: {}", updatedPermission.getPermissionKey());
        return permissionMapper.toDTO(updatedPermission);
    }

    // Tắt quyền
    @Override
    public void disablePermission(Long id) {
        Permission permission = permissionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy permission với id: " + id));
            
        permission.setActive(false);
        permissionRepository.save(permission);
        logger.info("Vô hiệu hóa permission: {}", permission.getPermissionKey());
    }

    //Bật quyền
    @Override
    public void enablePermission(Long id) {
        Permission permission = permissionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy permission với id: " + id));
        permission.setActive(true);
        permissionRepository.save(permission);
    }

    //Xóa quyền (kiểm tra xem quyền có được gán quyền cho gói nào không)
    @Override
    public void deletePermission(Long id) {
        Permission permission = permissionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy permission với id: " + id));
        if (permission.getPackagePermissions().isEmpty()) {
            permissionRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Quyền đang được sử dụng bởi gói dịch vụ");
        }
    }
}
