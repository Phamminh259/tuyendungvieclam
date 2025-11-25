package com.codeforworks.NTH_WorkFinder.service.impl;

import com.codeforworks.NTH_WorkFinder.dto.auth.login.LoginRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.auth.login.LoginResponseDTO;
import com.codeforworks.NTH_WorkFinder.dto.auth.register.EmployerRegisterDTO;
import com.codeforworks.NTH_WorkFinder.dto.auth.register.UserRegisterDTO;
import com.codeforworks.NTH_WorkFinder.model.*;
import com.codeforworks.NTH_WorkFinder.repository.*;
import com.codeforworks.NTH_WorkFinder.security.jwt.JwtTokenProvider;
import com.codeforworks.NTH_WorkFinder.security.service.AccountVerificationService;
import com.codeforworks.NTH_WorkFinder.security.service.EmailService;
import com.codeforworks.NTH_WorkFinder.service.IAuthService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class AuthService implements IAuthService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployerRepository employerRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private IndustryRepository industryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private AccountVerificationService accountVerificationService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private CandidateRepository candidateRepository;


    // DANG KY USER
    @Transactional
    @Override
    public void registerUser(UserRegisterDTO userDTO) throws MessagingException {
        try {
            // Validate input
            if (!userDTO.getPassword().equals(userDTO.getConfirmPassword())) {
                throw new IllegalArgumentException("Password và Confirm Password không khớp");
            }
            if (accountRepository.existsByEmail(userDTO.getEmail())) {
                throw new IllegalArgumentException("Email đã tồn tại");
            }

            // Tạo và lưu Account trước
            Account account = new Account();
            account.setEmail(userDTO.getEmail());
            account.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            account.setAccountType(Account.AccountType.USER);
            Role userRole = roleRepository.findByRoleName("ROLE_USER")
                    .orElseThrow(() -> new RuntimeException("Role ROLE_USER không tồn tại"));
            account.getRoles().add(userRole);
            account.setStatus(false);
            account = accountRepository.save(account); // Lưu account trước

            // Tạo và lưu User
            User user = new User();
            user.setFullName(userDTO.getFullName());
            user.setPhone(userDTO.getPhone());
            user.setAccount(account);
            user = userRepository.save(user); // Lưu user

            // Cập nhật lại account với user
            account.setUser(user);
            accountRepository.save(account);

            // Tạo và lưu Candidate
            Candidate candidate = new Candidate();
            candidate.setUser(user);
            candidate.setPhone(userDTO.getPhone());
            candidate.setIsAvailable(false);
            Candidate saveCandidate = candidateRepository.save(candidate);
            candidate.setCode("CAND-" + String.format("%05d", saveCandidate.getId()));

            candidateRepository.save(saveCandidate);



            // Gửi mã xác thực
            String verificationCode = generateVerificationCode();
            accountVerificationService.storeVerificationCode(userDTO.getEmail(), verificationCode);
            emailService.sendVerificationCode(userDTO.getEmail(), verificationCode);

            System.out.println("User registered successfully with email: " + userDTO.getEmail());
        } catch (Exception e) {
            System.err.println("Error during user registration: " + e.getMessage());
            throw e;
        }
    }

    //  DANG KY EMPLOYER
    @Transactional
    @Override
    public Employer registerEmployer(EmployerRegisterDTO employerDTO) {
        if (!employerDTO.getPassword().equals(employerDTO.getConfirmPassword())) {
            throw new IllegalArgumentException("Password và Confirm Password không khớp");
        }

        // Kiểm tra email đã tồn tại
        if (accountRepository.existsByEmail(employerDTO.getEmail())) {
            throw new IllegalArgumentException("Email đã tồn tại");
        }

        // Tạo và lưu Account
        Account account = new Account();
        account.setEmail(employerDTO.getEmail());
        account.setPassword(passwordEncoder.encode(employerDTO.getPassword()));
        account.setAccountType(Account.AccountType.EMPLOYER);

        // Gán role EMPLOYER
        Role employerRole = roleRepository.findByRoleName("ROLE_EMPLOYER")
                .orElseThrow(() -> new RuntimeException("Role ROLE_EMPLOYER không tồn tại"));
        account.getRoles().add(employerRole);
        account.setStatus(true);
        account = accountRepository.save(account);

        // Tìm Industry
        Industry industry = industryRepository.findByName(employerDTO.getIndustry())
                .orElseThrow(() -> new IllegalArgumentException("Lĩnh vực ngành nghề không tồn tại"));

        // Tạo Employer với đầy đủ thông tin
        Employer employer = new Employer();

        // Thông tin người liên hệ
        employer.setContactName(employerDTO.getContactName());
        employer.setContactPhone(employerDTO.getContactPhone());
        employer.setContactEmail(employerDTO.getEmail());
        employer.setContactPosition(employerDTO.getContactPosition());

        // Thông tin công ty
        employer.setCompanyName(employerDTO.getCompanyName());
        employer.setCompanyPhone(employerDTO.getCompanyPhone());
        employer.setCompanyAddress(employerDTO.getCompanyAddress());
        employer.setLocation(employerDTO.getLocation());
        employer.setIndustry(industry);

        employer.setAccount(account);
        // Tạo mã code
        employer.setCode("EMP-" + UUID.randomUUID().toString().substring(0, 8));

        // Thiết lập trạng thái ban đầu là ACTIVE
        employer.setStatus(Employer.EmployerStatus.ACTIVE);

        return employerRepository.save(employer);
    }

    //  TAO TK ADMIN
    @Transactional
    @Override
    public Admin createAdmin(String email, String password) {
        // Kiểm tra nếu email đã tồn tại
        if (accountRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email đã tồn tại");
        }

        Account account = new Account();
        account.setEmail(email);
        account.setPassword(passwordEncoder.encode(password)); // Mã hóa mật khẩu
        account.setAccountType(Account.AccountType.ADMIN);

        // Gán vai trò mặc định cho ADMIN
        Role adminRole = roleRepository.findByRoleName("ROLE_ADMIN")
                .orElseThrow(() -> new RuntimeException("Role ROLE_ADMIN không tồn tại"));
        account.getRoles().add(adminRole);

        account.setStatus(true);
        account = accountRepository.save(account);

        // Tạo đối tượng Admin liên kết với tài khoản
        Admin admin = new Admin();
        admin.setAccount(account);

        return adminRepository.save(admin);
    }

    //    XAC NHAN MA
    @Transactional
    @Override
    public void verifyAccount(String email, String code) {
        try {
            System.out.println("Verifying account for email: " + email); // Log để debug

            // Kiểm tra mã xác thực
            if (!accountVerificationService.verifyCode(email, code)) {
                throw new RuntimeException("Mã xác thực không đúng hoặc đã hết hạn");
            }

            // Tìm account theo email
            Account account = accountRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

            // Kiểm tra nếu tài khoản đã được kích hoạt
            if (account.getStatus()) {
                throw new RuntimeException("Tài khoản đã được kích hoạt trước đó");
            }

            // Tìm user và candidate
            User user = userRepository.findByAccount(account)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin người dùng"));

            // Kích hoạt tài khoản
            account.setStatus(true);
            accountRepository.save(account);

            // Tạo candidate nếu chưa có
            Candidate candidate = candidateRepository.findByUser(user)
                    .orElseGet(() -> {
                        Candidate newCandidate = new Candidate();
                        newCandidate.setUser(user);
                        newCandidate.setPhone(user.getPhone());
                        newCandidate.setCode("APP-" + String.format("%05d", candidateRepository.count() + 1));
                        newCandidate.setIsAvailable(true);
                        return candidateRepository.save(newCandidate);
                    });

            System.out.println("Account verified successfully for: " + email); // Log thành công
        } catch (Exception e) {
            System.err.println("Error during verification: " + e.getMessage()); // Log lỗi
            throw new RuntimeException("Xác thực thất bại: " + e.getMessage());
        }
    }

    //    GUI LA MA
    @Transactional
    @Override
    public void resendVerificationCode(String email) throws MessagingException {
        accountVerificationService.resendVerificationCode(email);
    }

    //    DANG NHAP
    @Override
    public LoginResponseDTO login(LoginRequestDTO loginRequest, Account.AccountType expectedAccountType, HttpServletResponse response) throws MessagingException {
        // Tìm tài khoản theo email
        Account account = accountRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Email hoặc mật khẩu không hợp lệ"));

        //Kiểm tra Email đã Kích hoạt trong login
        if (!account.getStatus()) {
            throw new RuntimeException("Tài khoản chưa được xác thực. Vui lòng xác thực tài khoản trước khi đăng nhập.");
        }

        // Kiểm tra loại tài khoản
        if (!account.getAccountType().equals(expectedAccountType)) {
            throw new RuntimeException("Truy cập trái phép tài khoan");
        }

        // Xác thực thông tin đăng nhập
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        // Đặt Authentication vào SecurityContext
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Tạo JWT token
        String jwtToken = jwtTokenProvider.generateToken(authentication);

        // Đặt JWT token vào cookie HTTP-only
        Cookie jwtCookie = new Cookie("jwtToken", jwtToken);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(true); // Đặt true nếu dùng HTTPS
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(24 * 60 * 60); // Thời hạn cookie là 1 ngày
        response.addCookie(jwtCookie);

        // Kiểm tra nếu đây là lần đăng nhập đầu tiên
        if (account.getLoggedIn() == null || !account.getLoggedIn()) {
            // Gửi email thông báo
            emailService.sendRegistrationSuccessEmail(loginRequest.getEmail(), account.getEmail());

            // Cập nhật trạng thái đăng nhập để chỉ gửi email này một lần
            account.setLoggedIn(true);
            accountRepository.save(account);
        }

        // Phản hồi tùy theo loại tài khoản
        switch (account.getAccountType()) {
            case ADMIN:
                return new LoginResponseDTO("Đăng nhập admin thành công", jwtToken);
            case EMPLOYER:
                return new LoginResponseDTO("Đăng nhập employer thành công", jwtToken);
            default:
                return new LoginResponseDTO("Đăng nhập thành công. Vui lòng kiểm tra email để nhận mã xác thực.", jwtToken);
        }
    }

    // Gửi email yêu cầu thay đổi mật khẩu
    public boolean sendPasswordResetEmail(String email) throws MessagingException {
        Optional<Account> account = accountRepository.findByEmail(email);
        if (account.isPresent()) {
            String resetCode = generateVerificationCode(); // Tạo mã xác nhận
            accountVerificationService.storeVerificationCode(email, resetCode); // Lưu mã xác nhận vào bộ nhớ tạm
            emailService.sendPasswordResetEmail(email, resetCode); // Gửi email chứa mã OTP
            return true;
        }
        return false;
    }

    // Đặt lại mật khẩu
    public boolean resetPassword(String email, String code, String newPassword) {
        if (accountVerificationService.verifyCode(email, code)) {
            Optional<Account> account = accountRepository.findByEmail(email);
            if (account.isPresent()) {
                account.get().setPassword(passwordEncoder.encode(newPassword)); // Mã hóa mật khẩu mới
                accountRepository.save(account.get());
                return true;
            }
        }
        return false;
    }

    // Tạo mã xác thực ngẫu nhiên (6 chữ số)
    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
}
