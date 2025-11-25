package com.codeforworks.NTH_WorkFinder.service.impl;

import com.codeforworks.NTH_WorkFinder.dto.role.RoleAssignmentDTO;
import com.codeforworks.NTH_WorkFinder.dto.role.RoleRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.role.RoleResponseDTO;
import com.codeforworks.NTH_WorkFinder.mapper.RoleMapper;
import com.codeforworks.NTH_WorkFinder.model.Account;
import com.codeforworks.NTH_WorkFinder.model.Role;
import com.codeforworks.NTH_WorkFinder.repository.AccountRepository;
import com.codeforworks.NTH_WorkFinder.repository.RoleRepository;
import com.codeforworks.NTH_WorkFinder.service.IRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoleService implements IRoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private AccountRepository accountRepository;

    private void checkDuplicateRoleName(String roleName, Long excludeId) {
        Role existingRole = roleRepository.findByRoleNameIgnoreCase(roleName);
        if (existingRole != null && !existingRole.getId().equals(excludeId)) {
            throw new RuntimeException("Role với tên '" + roleName + "' đã tồn tại!");
        }
    }

    private void checkRoleInUse(Long roleId) {
        long accountCount = accountRepository.countByRoles_Id(roleId);
        if (accountCount > 0) {
            throw new RuntimeException("Không thể xóa role đang được sử dụng bởi " + accountCount + " tài khoản!");
        }
    }

    @Override
    public RoleResponseDTO createRole(RoleRequestDTO roleRequestDTO) {
        checkDuplicateRoleName(roleRequestDTO.getRoleName(), null);
        
        Role role = new Role();
        role.setRoleName(roleRequestDTO.getRoleName());
        role.setDescription(roleRequestDTO.getDescription());
        Role savedRole = roleRepository.save(role);
        return RoleMapper.INSTANCE.toRoleResponseDTO(savedRole);
    }

    @Override
    public RoleResponseDTO getRoleById(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        return RoleMapper.INSTANCE.toRoleResponseDTO(role);
    }

    @Override
    public List<RoleResponseDTO> getAllRoles() {
        List<Role> roles = roleRepository.findAll();
        return roles.stream()
                .map(RoleMapper.INSTANCE::toRoleResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RoleResponseDTO updateRole(Long id, RoleRequestDTO roleRequestDTO) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
                
        checkDuplicateRoleName(roleRequestDTO.getRoleName(), id);

        role.setRoleName(roleRequestDTO.getRoleName());
        role.setDescription(roleRequestDTO.getDescription());
        Role updatedRole = roleRepository.save(role);
        return RoleMapper.INSTANCE.toRoleResponseDTO(updatedRole);
    }

    @Override
    public void deleteRole(Long id) {
        if (!roleRepository.existsById(id)) {
            throw new RuntimeException("Role not found");
        }
        checkRoleInUse(id);
        roleRepository.deleteById(id);
    }

    @Override
    public void assignRoleToAccount(RoleAssignmentDTO roleAssignmentDTO) {
        Account account = accountRepository.findById(roleAssignmentDTO.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));
        Role role = roleRepository.findById(roleAssignmentDTO.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));
                
        if (account.getRoles().contains(role)) {
            throw new RuntimeException("Account đã có role này!");
        }
        
        account.getRoles().add(role);
        accountRepository.save(account);
    }

    @Override
    public void removeRoleFromAccount(RoleAssignmentDTO roleAssignmentDTO) {
        Account account = accountRepository.findById(roleAssignmentDTO.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));
        Role role = roleRepository.findById(roleAssignmentDTO.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));
        account.getRoles().remove(role);
        accountRepository.save(account);
    }

    @Override
    public List<RoleResponseDTO> getRolesByAccountId(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        return account.getRoles().stream()
                .map(RoleMapper.INSTANCE::toRoleResponseDTO)
                .collect(Collectors.toList());
    }
}
