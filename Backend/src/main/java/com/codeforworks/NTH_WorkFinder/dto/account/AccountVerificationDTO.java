package com.codeforworks.NTH_WorkFinder.dto.account;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AccountVerificationDTO {
    private String email;
    private String verificationCode; // Thuộc tính để lưu mã xác thực tạm thời
    private LocalDateTime expiryTime;// Thời điểm tạo mã OTP
}
