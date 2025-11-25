package com.codeforworks.NTH_WorkFinder.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codeforworks.NTH_WorkFinder.dto.auth.login.LoginRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.auth.login.LoginResponseDTO;
import com.codeforworks.NTH_WorkFinder.dto.auth.register.EmployerRegisterDTO;
import com.codeforworks.NTH_WorkFinder.dto.auth.register.UserRegisterDTO;
import com.codeforworks.NTH_WorkFinder.model.Account;
import com.codeforworks.NTH_WorkFinder.model.Admin;
import com.codeforworks.NTH_WorkFinder.model.Role;
import com.codeforworks.NTH_WorkFinder.model.User;
import com.codeforworks.NTH_WorkFinder.repository.AccountRepository;
import com.codeforworks.NTH_WorkFinder.repository.UserRepository;
import com.codeforworks.NTH_WorkFinder.service.IAuthService;

import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private IAuthService authService;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register/user")
    public ResponseEntity<String> registerUser(@RequestBody UserRegisterDTO userDTO) throws MessagingException {
        authService.registerUser(userDTO);
        return ResponseEntity.ok("Đăng ký thành công. Vui lòng kiểm tra email để nhận mã xác thực.");
    }

    @PostMapping("/register/employer")
    public ResponseEntity<String> registerEmployer(@RequestBody EmployerRegisterDTO employerDTO) throws MessagingException {
        authService.registerEmployer(employerDTO);
        return ResponseEntity.ok("Đăng ký tai khoan NTD thành công.");
    }


    @PostMapping("/create/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Admin> createAdmin(@RequestParam String email, @RequestParam String password) {
        Admin admin = authService.createAdmin(email, password);
        return ResponseEntity.status(HttpStatus.CREATED).body(admin);
    }

    // Xác thực tài khoản bằng mã OTP
    @PostMapping("/verify")
    public ResponseEntity<?> verifyAccount(@RequestParam String email, @RequestParam String code) {
        try {
            System.out.println("Received verification request for email: " + email); // Log request

            // Kiểm tra tham số đầu vào
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email không được để trống");
            }
            if (code == null || code.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Mã xác thực không được để trống");
            }

            // Gọi service để xác thực
            authService.verifyAccount(email, code);

            // Trả về response thành công
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Tài khoản đã được xác thực thành công");
            response.put("timestamp", new Date());
            response.put("status", "SUCCESS");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("Verification failed: " + e.getMessage()); // Log lỗi

            // Trả về response lỗi
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("timestamp", new Date());
            errorResponse.put("status", "ERROR");

            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // Gửi lại mã OTP cho tài khoản
    @PostMapping("/resend-otp")
    public ResponseEntity<String> resendOtp(@RequestParam String email) throws MessagingException {
        authService.resendVerificationCode(email);
        return ResponseEntity.ok("Mã xác thực mới đã được gửi.");
    }

    // Đăng nhập
    @PostMapping("/login/{accountType}")
    public ResponseEntity<LoginResponseDTO> login(@PathVariable("accountType") String accountType, @RequestBody LoginRequestDTO loginRequest, HttpServletResponse response) throws MessagingException {

        // Xác định loại tài khoản từ chuỗi
        Account.AccountType expectedAccountType;
        try {
            expectedAccountType = Account.AccountType.valueOf(accountType.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new LoginResponseDTO("Loại tài khoản không hợp lệ", null));
        }

        // Thực hiện đăng nhập
        LoginResponseDTO responseDTO = authService.login(loginRequest, expectedAccountType, response);
        return ResponseEntity.ok(responseDTO);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {
        // Tạo cookie mới với cùng tên nhưng không có giá trị
        Cookie jwtCookie = new Cookie("jwtToken", null);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(true); // Đặt true nếu dùng HTTPS
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(0); // Cookie hết hạn ngay lập tức

        // Thêm cookie vào phản hồi
        response.addCookie(jwtCookie);

        return ResponseEntity.ok("Đăng xuất thành công.");
    }

    // Yêu cầu thay đổi mật khẩu
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) throws MessagingException {
        boolean isEmailSent = authService.sendPasswordResetEmail(email);
        if (isEmailSent) {
            return ResponseEntity.ok("Mã xác minh đã được gửi đến email của bạn.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email không tồn tại.");
        }
    }

    // Đặt lại mật khẩu
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String email, @RequestParam String code, @RequestParam String newPassword) {
        boolean isReset = authService.resetPassword(email, code, newPassword);
        if (isReset) {
            return ResponseEntity.ok("Mật khẩu đã được thay đổi thành công.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Mã xác minh không hợp lệ hoặc đã hết hạn.");
        }
    }

    //kiểm tra token
    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            return ResponseEntity.ok(authentication.getPrincipal()); // Trả về thông tin người dùng
        } else {
            return ResponseEntity.status(401).body("Mã thông báo không hợp lệ hoặc đã hết hạn"); // Trả về lỗi 401 nếu không hợp lệ
        }
    }

    //lấy thông tin người dùng đang đăng nhập oauth2
    @GetMapping("/oauth2/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        try {
            if (authentication == null) {
                System.out.println("Authentication is null");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Không có người dùng nào đang đăng nhập.");
            }

            String email = authentication.getName();
            System.out.println("Email from authentication: " + email);

            // Tìm account
            Account account = accountRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));
            System.out.println("Found account with ID: " + account.getId());

            // Tìm hoặc tạo user
            User user = userRepository.findByAccount(account)
                    .orElseGet(() -> {
                        System.out.println("User not found, creating new user");
                        User newUser = new User();
                        newUser.setFullName(email.split("@")[0]); // Tạm dùng email làm tên
                        newUser.setPhone("N/A");
                        newUser.setAccount(account);

                        // Lưu user mới
                        User savedUser = userRepository.save(newUser);
                        System.out.println("Created new user with ID: " + savedUser.getId());

                        // Cập nhật account
                        account.setUser(savedUser);
                        accountRepository.save(account);

                        return savedUser;
                    });

            // Tạo response
            Map<String, Object> userDetails = new HashMap<>();
            userDetails.put("id", account.getId());
            userDetails.put("email", account.getEmail());
            userDetails.put("fullName", user.getFullName());
            userDetails.put("roles", account.getRoles().stream()
                    .map(Role::getRoleName)
                    .collect(Collectors.toList()));

            System.out.println("Returning user details: " + userDetails);
            return ResponseEntity.ok(userDetails);

        } catch (Exception e) {
            System.out.println("Error in getCurrentUser: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Lỗi khi lấy thông tin người dùng",
                            "message", e.getMessage(),
                            "timestamp", new Date()
                    ));
        }
    }

    // Xử lý lỗi OAuth2
    @GetMapping("/oauth2/error")
    public ResponseEntity<String> handleOAuth2Error() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("OAuth2 authentication failed");
    }

}
