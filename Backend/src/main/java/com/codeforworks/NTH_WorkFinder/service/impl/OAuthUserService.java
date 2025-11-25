package com.codeforworks.NTH_WorkFinder.service.impl;

import com.codeforworks.NTH_WorkFinder.model.Account;
import com.codeforworks.NTH_WorkFinder.model.Role;
import com.codeforworks.NTH_WorkFinder.model.User;
import com.codeforworks.NTH_WorkFinder.repository.AccountRepository;
import com.codeforworks.NTH_WorkFinder.repository.RoleRepository;
import com.codeforworks.NTH_WorkFinder.repository.UserRepository;
import com.codeforworks.NTH_WorkFinder.security.jwt.JwtTokenProvider;
import com.codeforworks.NTH_WorkFinder.security.service.EmailService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class OAuthUserService extends DefaultOAuth2UserService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private HttpServletResponse response;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        try {
            String provider = userRequest.getClientRegistration().getRegistrationId();
            String email;
            final String name;

            if ("github".equals(provider)) {
                email = extractEmail(oAuth2User);
                name = oAuth2User.getAttribute("name") != null ? 
                      oAuth2User.getAttribute("name") : 
                      oAuth2User.getAttribute("login");
            } else {
                email = oAuth2User.getAttribute("email");
                name = oAuth2User.getAttribute("name");
            }

            if (email == null) {
                throw new OAuth2AuthenticationException("Email not available");
            }

            System.out.println("Processing OAuth2 login for: " + email + " from " + provider);

            Account account = accountRepository.findByEmail(email).orElseGet(() -> {
                // Tạo account mới
                Account newAccount = new Account();
                newAccount.setEmail(email);
                newAccount.setAccountType(Account.AccountType.USER);
                newAccount.setPassword(passwordEncoder.encode("030303zxzx"));

                Role userRole = roleRepository.findByRoleName("ROLE_USER")
                        .orElseThrow(() -> new RuntimeException("Role ROLE_USER không tồn tại"));
                newAccount.getRoles().add(userRole);

                // Lưu account trước
                Account savedAccount = accountRepository.save(newAccount);

                // Tạo và lưu user
                User user = new User();
                user.setFullName(name);
                user.setAccount(savedAccount);
                User savedUser = userRepository.save(user);

                // Cập nhật lại account với user
                savedAccount.setUser(savedUser);
                return accountRepository.save(savedAccount);
            });

            // Phần code còn lại giữ nguyên
            List<GrantedAuthority> authorities = account.getRoles().stream()
                    .map(role -> new SimpleGrantedAuthority(role.getRoleName()))
                    .collect(Collectors.toList());

            Map<String, Object> attributes = new HashMap<>(oAuth2User.getAttributes());
            attributes.put("id", account.getId());

            DefaultOAuth2User customOAuth2User = new DefaultOAuth2User(
                    authorities,
                    attributes,
                    "email"
            );

            String jwtToken = jwtTokenProvider.generateToken(
                    new OAuth2AuthenticationToken(customOAuth2User, authorities, "google")
            );

            Cookie jwtCookie = new Cookie("jwtToken", jwtToken);
            jwtCookie.setHttpOnly(true);
            jwtCookie.setSecure(true);
            jwtCookie.setPath("/");
            jwtCookie.setMaxAge(24 * 60 * 60);
            response.addCookie(jwtCookie);

            return customOAuth2User;
        } catch (Exception e) {
            throw new OAuth2AuthenticationException("Lỗi xử lý OAuth2: " + e.getMessage());
        }
    }

    private String extractEmail(OAuth2User oAuth2User) {
        String email = oAuth2User.getAttribute("email");
        if (email == null) {
            // Thử lấy email từ emails array của GitHub
            List<Map<String, Object>> emails = oAuth2User.getAttribute("emails");
            if (emails != null && !emails.isEmpty()) {
                email = (String) emails.get(0).get("email");
            }
        }
        return email;
    }

}
