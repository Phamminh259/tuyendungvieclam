package com.codeforworks.NTH_WorkFinder.controller;

import com.codeforworks.NTH_WorkFinder.dto.permission.PermissionRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.permission.PermissionResponseDTO;
import com.codeforworks.NTH_WorkFinder.service.IPermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
public class PermissionController {
    private final IPermissionService permissionService;

    //Tạo quyền
    @PostMapping
    public ResponseEntity<PermissionResponseDTO> createPermission(@RequestBody PermissionRequestDTO requestDTO) {
        return ResponseEntity.ok(permissionService.createPermission(requestDTO));
    }

    //Lấy quyền theo id
    @GetMapping("/get-by/{id}")
    public ResponseEntity<PermissionResponseDTO> getPermission(@PathVariable Long id) {
        return ResponseEntity.ok(permissionService.getPermissionById(id));
    }

    //Lấy tất cả quyền
    @GetMapping("/list")
    public ResponseEntity<List<PermissionResponseDTO>> getAllPermissions() {
        return ResponseEntity.ok(permissionService.getAllPermissions());
    }

    //Cập nhật quyền
    @PutMapping("/{id}")
    public ResponseEntity<PermissionResponseDTO> updatePermission(
            @PathVariable Long id,
            @RequestBody PermissionRequestDTO requestDTO) {
        return ResponseEntity.ok(permissionService.updatePermission(id, requestDTO));
    }

    //Tắt quyền
    @PutMapping("/disable/{id}")
    public ResponseEntity<Void> disablePermission(@PathVariable Long id) {
        permissionService.disablePermission(id);
        return ResponseEntity.ok().build();
    }

    //Bật quyền
    @PutMapping("/enable/{id}")
    public ResponseEntity<Void> enablePermission(@PathVariable Long id) {
        permissionService.enablePermission(id);
        return ResponseEntity.ok().build();
    }

    //Xóa quyền
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePermission(@PathVariable Long id) {
        permissionService.deletePermission(id);
        return ResponseEntity.ok().build();
    }
}
