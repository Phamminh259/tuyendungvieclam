package com.codeforworks.NTH_WorkFinder.controller;

import com.codeforworks.NTH_WorkFinder.dto.role.RoleAssignmentDTO;
import com.codeforworks.NTH_WorkFinder.dto.role.RoleRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.role.RoleResponseDTO;
import com.codeforworks.NTH_WorkFinder.service.IRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    @Autowired
    private IRoleService roleService;

    @PostMapping
    public ResponseEntity<RoleResponseDTO> createRole(@RequestBody RoleRequestDTO roleRequestDTO) {
        RoleResponseDTO createdRole = roleService.createRole(roleRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRole);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoleResponseDTO> getRoleById(@PathVariable Long id) {
        RoleResponseDTO role = roleService.getRoleById(id);
        return ResponseEntity.ok(role);
    }

    @GetMapping
    public ResponseEntity<List<RoleResponseDTO>> getAllRoles() {
        List<RoleResponseDTO> roles = roleService.getAllRoles();
        return ResponseEntity.ok(roles);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoleResponseDTO> updateRole(
            @PathVariable Long id,
            @RequestBody RoleRequestDTO roleRequestDTO) {
        RoleResponseDTO updatedRole = roleService.updateRole(id, roleRequestDTO);
        return ResponseEntity.ok(updatedRole);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return ResponseEntity.noContent().build();
    }

    //Gán vai trò cho tài khoản.
    @PostMapping("/assign")
    public ResponseEntity<Void> assignRoleToAccount(@RequestBody RoleAssignmentDTO roleAssignmentDTO) {
        roleService.assignRoleToAccount(roleAssignmentDTO);
        return ResponseEntity.ok().build();
    }

    //Xóa vai trò khỏi tài khoản.
    @PostMapping("/remove")
    public ResponseEntity<Void> removeRoleFromAccount(@RequestBody RoleAssignmentDTO roleAssignmentDTO) {
        roleService.removeRoleFromAccount(roleAssignmentDTO);
        return ResponseEntity.ok().build();
    }

    //Lấy danh sách vai trò của tài khoản.
    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<RoleResponseDTO>> getRolesByAccountId(@PathVariable Long accountId) {
        List<RoleResponseDTO> roles = roleService.getRolesByAccountId(accountId);
        return ResponseEntity.ok(roles);
    }
}
