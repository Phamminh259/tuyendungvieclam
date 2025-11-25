package com.codeforworks.NTH_WorkFinder.security.service;

import com.codeforworks.NTH_WorkFinder.dto.account.AccountVerificationDTO;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AccountVerificationService {

    // Lưu trữ OTP tạm thời với email là key
    private final Map<String, AccountVerificationDTO> otpStorage = new ConcurrentHashMap<>();
    private static final int MAX_RESEND_ATTEMPTS = 3; // Số lần gửi lại tối đa
    private final Map<String, Integer> resendAttempts = new ConcurrentHashMap<>();

    @Autowired
    private EmailService emailService;

    // Thêm OTP vào bộ nhớ tạm thời
    public void storeVerificationCode(String email, String verificationCode) {
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(5); // Tăng lên 5 phút
        AccountVerificationDTO verificationDTO = new AccountVerificationDTO(email, verificationCode, expiryTime);
        otpStorage.put(email, verificationDTO);
    }

    // Kiểm tra OTP
    public boolean verifyCode(String email, String code) {
        AccountVerificationDTO verificationDTO = otpStorage.get(email);

        if (verificationDTO == null) {
            throw new RuntimeException("Không tìm thấy mã xác minh");
        }

        if (!verificationDTO.getVerificationCode().equals(code)) {
            throw new RuntimeException("Mã xác minh không hợp lệ");
        }

        if (verificationDTO.getExpiryTime().isBefore(LocalDateTime.now())) {
            otpStorage.remove(email);
            throw new RuntimeException("Mã xác minh đã hết hạn");
        }

        // Xóa OTP và reset số lần gửi lại sau khi xác thực thành công
        otpStorage.remove(email);
        resetResendAttempts(email);
        return true;
    }

    // Phương thức gửi lại mã OTP
    public void resendVerificationCode(String email) throws MessagingException {
        // Kiểm tra số lần gửi lại
        int attempts = resendAttempts.getOrDefault(email, 0);
        if (attempts >= MAX_RESEND_ATTEMPTS) {
            throw new RuntimeException("Bạn đã vượt quá số lần gửi lại mã cho phép. Vui lòng thử lại sau.");
        }

        AccountVerificationDTO verificationDTO = otpStorage.get(email);
        if (verificationDTO == null || verificationDTO.getExpiryTime().isBefore(LocalDateTime.now())) {
            String newVerificationCode = generateVerificationCode();
            LocalDateTime newExpiryTime = LocalDateTime.now().plusMinutes(5);
            verificationDTO = new AccountVerificationDTO(email, newVerificationCode, newExpiryTime);
            otpStorage.put(email, verificationDTO);

            // Tăng số lần gửi lại
            resendAttempts.put(email, attempts + 1);

            // Gửi lại mã qua email
            emailService.sendVerificationCode(email, newVerificationCode);
        } else {
            throw new RuntimeException("Vui lòng chờ trước khi yêu cầu mã mới.");
        }
    }

    // Thêm phương thức reset số lần gửi lại sau khi xác thực thành công
    public void resetResendAttempts(String email) {
        resendAttempts.remove(email);
    }

    // Hàm tạo mã OTP ngẫu nhiên
    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // Tạo mã 6 chữ số
        return String.valueOf(code);
    }
}