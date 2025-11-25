package com.codeforworks.NTH_WorkFinder.security.oauth2;

import com.codeforworks.NTH_WorkFinder.config.AppConfig;
import com.codeforworks.NTH_WorkFinder.model.Account;
import com.codeforworks.NTH_WorkFinder.model.Role;
import com.codeforworks.NTH_WorkFinder.model.User;
import com.codeforworks.NTH_WorkFinder.model.Candidate;
import com.codeforworks.NTH_WorkFinder.repository.AccountRepository;
import com.codeforworks.NTH_WorkFinder.repository.RoleRepository;
import com.codeforworks.NTH_WorkFinder.repository.UserRepository;
import com.codeforworks.NTH_WorkFinder.repository.CandidateRepository;
import com.codeforworks.NTH_WorkFinder.security.jwt.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Transactional
public class OAuth2LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

 
    private final AccountRepository accountRepository;

  
    private final RoleRepository roleRepository;


    private final UserRepository userRepository;
    

    private final CandidateRepository candidateRepository;


    private final JwtTokenProvider tokenProvider;

    private final AppConfig appConfig;

    private String extractEmail(OAuth2User oAuth2User, String provider) {
        try {
            if ("google".equals(provider)) {
                return oAuth2User.getAttribute("email");
            } else if ("github".equals(provider)) {
                // In ra tất cả thuộc tính để debug
                System.out.println("All GitHub attributes: " + oAuth2User.getAttributes());
                
                String email = oAuth2User.getAttribute("email");
                if (email != null) {
                    return email;
                }
                
                // Thử lấy email từ node emails nếu có
                List<Map<String, Object>> emails = oAuth2User.getAttribute("emails");
                if (emails != null && !emails.isEmpty()) {
                    return (String) emails.get(0).get("email");
                }
                
                // Nếu không có email, dùng login name + github.com
                String login = oAuth2User.getAttribute("login");
                if (login != null) {
                    return login + "@github.com";
                }
            }
        } catch (Exception e) {
            System.out.println("Error extracting email: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    private String extractName(OAuth2User oAuth2User, String provider) {
        try {
            if ("google".equals(provider)) {
                return oAuth2User.getAttribute("name");
            } else if ("github".equals(provider)) {
                String name = oAuth2User.getAttribute("name");
                if (name != null) {
                    return name;
                }
                return oAuth2User.getAttribute("login");
            }
        } catch (Exception e) {
            System.out.println("Error extracting name: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    private String extractPicture(OAuth2User oAuth2User, String provider) {
        if ("google".equals(provider)) {
            return oAuth2User.getAttribute("picture");
        } else if ("github".equals(provider)) {
            return oAuth2User.getAttribute("avatar_url");
        }
        return null;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                    Authentication authentication) throws IOException {
        try {
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            String provider = ((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId();
            
            System.out.println("OAuth2 Provider: " + provider);
            System.out.println("OAuth2User details: " + oAuth2User.getAttributes());
            
            String email = extractEmail(oAuth2User, provider);
            String name = extractName(oAuth2User, provider);
            String picture = extractPicture(oAuth2User, provider);

            if (email == null) {
                throw new RuntimeException("Không thể lấy email từ " + provider);
            }

            System.out.println("Processing OAuth2 login for: " + email + " from " + provider);
            System.out.println("Name: " + name);
            System.out.println("Picture: " + picture);

            Account account = accountRepository.findByEmail(email)
                    .orElseGet(() -> {
                        Account newAccount = new Account();
                        newAccount.setEmail(email);
                        newAccount.setAccountType(Account.AccountType.USER);
                        newAccount.setStatus(true);

                        Role userRole = roleRepository.findByRoleName("ROLE_USER")
                                .orElseThrow(() -> new RuntimeException("Role not found"));
                        newAccount.getRoles().add(userRole);

                        Account savedAccount = accountRepository.save(newAccount);
                        System.out.println("Created new account with ID: " + savedAccount.getId());

                        User user = new User();
                        user.setFullName(name != null ? name : email.split("@")[0]);
                        user.setAccount(savedAccount);
                        User savedUser = userRepository.save(user);
                        System.out.println("Created new user with ID: " + savedUser.getId());

                        Candidate candidate = new Candidate();
                        candidate.setUser(savedUser);
                        candidate.setCode("CAND-" + String.format("%05d", candidateRepository.count() + 1));
                        candidate.setAvatar(picture);
                        candidate.setIsAvailable(false);
                        candidateRepository.save(candidate);
                        System.out.println("Created new candidate for user ID: " + savedUser.getId());

                        savedAccount.setUser(savedUser);
                        return accountRepository.save(savedAccount);
                    });

            if (account.getUser() != null && account.getUser().getCandidate() == null) {
                User user = account.getUser();
                Candidate candidate = new Candidate();
                candidate.setUser(user);
                candidate.setCode("CAND-" + String.format("%05d", candidateRepository.count() + 1));
                candidate.setAvatar(picture);
                candidate.setIsAvailable(false);
                candidateRepository.save(candidate);
                System.out.println("Created new candidate for existing user ID: " + user.getId());
            }

            String token = tokenProvider.generateToken(authentication);
            System.out.println("Generated token successfully");

            String targetUrl = UriComponentsBuilder.fromUriString(appConfig.getFrontendUrl() + "/oauth2/redirect")
                    .queryParam("token", token)
                    .build().toUriString();

            getRedirectStrategy().sendRedirect(request, response, targetUrl);

        } catch (Exception e) {
            System.out.println("Detailed error in OAuth2 success handler: ");
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("OAuth2 authentication failed: " + e.getMessage());
            return;
        }
    }
}