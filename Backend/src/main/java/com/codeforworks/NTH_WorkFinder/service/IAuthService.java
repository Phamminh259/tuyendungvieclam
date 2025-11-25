package com.codeforworks.NTH_WorkFinder.service;

import com.codeforworks.NTH_WorkFinder.dto.auth.login.LoginRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.auth.login.LoginResponseDTO;
import com.codeforworks.NTH_WorkFinder.dto.auth.register.EmployerRegisterDTO;
import com.codeforworks.NTH_WorkFinder.dto.auth.register.UserRegisterDTO;
import com.codeforworks.NTH_WorkFinder.model.Account;
import com.codeforworks.NTH_WorkFinder.model.Admin;
import com.codeforworks.NTH_WorkFinder.model.Employer;
import com.codeforworks.NTH_WorkFinder.model.User;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;

public interface IAuthService {

    void registerUser(UserRegisterDTO userDTO) throws MessagingException;

    Employer registerEmployer(EmployerRegisterDTO employerDTO)throws MessagingException;

    Admin createAdmin(String email, String password);

    void verifyAccount(String email, String code);

    LoginResponseDTO login(LoginRequestDTO loginRequest, Account.AccountType expectedAccountType, HttpServletResponse response)throws MessagingException;

    void resendVerificationCode(String email) throws MessagingException;

    boolean sendPasswordResetEmail(String email) throws MessagingException;

    boolean resetPassword(String email, String code, String newPassword);

}
