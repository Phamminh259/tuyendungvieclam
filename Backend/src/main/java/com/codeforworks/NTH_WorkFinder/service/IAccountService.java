package com.codeforworks.NTH_WorkFinder.service;

import com.codeforworks.NTH_WorkFinder.dto.account.AccountResponseDTO;
import java.util.List;

public interface IAccountService {
    // Lấy tất cả tài khoản
    List<AccountResponseDTO> getAllAccounts();
    
    // Lấy tài khoản theo id
    AccountResponseDTO getAccountById(Long id);
    
    // Lấy tài khoản theo email
    AccountResponseDTO getAccountByEmail(String email);
    
    // Vô hiệu hóa tài khoản
    void deactivateAccount(Long id);
    
    // Kích hoạt tài khoản
    void activateAccount(Long id);
} 