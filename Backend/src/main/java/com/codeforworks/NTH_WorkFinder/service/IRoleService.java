package com.codeforworks.NTH_WorkFinder.service;

import com.codeforworks.NTH_WorkFinder.dto.role.RoleAssignmentDTO;
import com.codeforworks.NTH_WorkFinder.dto.role.RoleRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.role.RoleResponseDTO;

import java.util.List;

public interface IRoleService {

    RoleResponseDTO createRole(RoleRequestDTO roleRequestDTO);

    RoleResponseDTO getRoleById(Long id);

    List<RoleResponseDTO> getAllRoles();

    RoleResponseDTO updateRole(Long id, RoleRequestDTO roleRequestDTO);

    void deleteRole(Long id);

    //Gán vai trò cho tài khoản.
    void assignRoleToAccount(RoleAssignmentDTO roleAssignmentDTO);

    //Xóa vai trò khỏi tài khoản.
    void removeRoleFromAccount(RoleAssignmentDTO roleAssignmentDTO);

    //Lấy danh sách vai trò của tài khoản.
    List<RoleResponseDTO> getRolesByAccountId(Long accountId);
}
