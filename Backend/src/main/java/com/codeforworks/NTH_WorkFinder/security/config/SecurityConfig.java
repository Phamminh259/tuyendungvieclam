package com.codeforworks.NTH_WorkFinder.security.config;

import com.codeforworks.NTH_WorkFinder.config.AppConfig;
import com.codeforworks.NTH_WorkFinder.security.jwt.JwtAuthEntryPoint;
import com.codeforworks.NTH_WorkFinder.security.jwt.JwtAuthenticationFilter;
import com.codeforworks.NTH_WorkFinder.security.oauth2.OAuth2LoginSuccessHandler;
import com.codeforworks.NTH_WorkFinder.service.impl.OAuthUserService;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Configuration
@Getter
@EnableWebSecurity
@RequiredArgsConstructor
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private static final String[] AUTH_WHITELIST = {
            "/swagger-resources",
            "/swagger-ui.html",
            "/v2/api-docs",
            "/webjars",
            "/error",
            "/favicon.ico",
            "/*.png",
            "/*.gif",
            "/*.svg",
            "/*.jpg",
            "/*.html",
            "/*.css",
            "/*.js",
            "/ws/**",
            "/topic/**",
            "/app/**"
    };

    private final JwtAuthEntryPoint jwtAuthEntryPoint;

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    private final OAuthUserService oAuthUserService;

    private final AppConfig appConfig;

    //  QUYỀN ALL
    private static final List<String> PERMIT_ALL_URLS = List.of(
            "/v3/api-docs",
            "/swagger-ui",
            "/swagger-ui.html",
            "/api/auth/register/**",
            "/api/auth/create/admin",
            "/api/auth/**",
            "/api/auth/login/**",
            "/api/auth/oauth2/me",
            "/oauth2/authorization/**",
            "/login/oauth2/code/**",
            "/api/industries/list",
            "/api/industries/get-by/{id}",
            "/api/professions/list",
            "/api/professions/get-by/{id}",
            "/api/professions/industry/{industryId}",
            "/api/skills/list",
            "/api/skills/get-by/{id}",
            "/api/employers/get-by/{id}",
            "/api/employers/list",
            "/api/employers/search",
            "/api/employers/{id}/jobs",
            "/api/jobs/get-by/{id}",
            "/api/jobs/list",
            "/api/jobs/employer/{employerId}",
            "/api/jobs/search",
            "/api/jobs/{id}/details",
            "/api/jobs/hot",
            "/api/jobs/latest",
            "/api/jobs/quota/{employerId}",
            "/api/job-skills/job/{jobId}",
            "/api/job-skills/job/{jobId}/required",
            "/api/job-skills/job/{jobId}/level/{proficiencyLevel}",
            "/api/packages/list",
            "/api/packages/get-by/{id}",
            "/api/files/upload",
            "/api/files/delete/{publicId}",
            "/api/interviews/application/{applicationId}",
            "/api/interviews/candidate/{candidateId}",
            "/api/payments/vnpay-return",
            "/api/payments/paypal/success",
            "/api/chatroom/**",
            "/api/chatbot/**",
            "/api/payments/**",
            "/api/candidates/{candidateId}/work-histories"

    );

    //  QUYEN USER
    private static final Map<String, List<String>> USER_PERMISSIONS = Map.of(
            "GET", List.of(
                    "/api/candidates/get-by/{id}",
                    "/api/candidates/get-by-email/{email}",
                    "/api/candidate-skills/**",
                    "/api/applications/get-by/{id}",
                    "/api/applications/candidate/{candidateId}",
                    "/api/candidates/{candidateId}/saved-jobs",
                    "/api/notifications/account/{accountId}",
                    "/api/notifications/account/{accountId}/unread-count",
                    "/api/interviews/{id}",
                    "/api/candidates/{candidateId}/work-histories/{workHistoryId}"
            ),
            "POST", List.of(
                    "/api/candidates",
                    "/api/candidates/{candidateId}/work-histories",
                    "/api/candidate-skills/{candidateId}",
                    "/api/candidates/{candidateId}/save-job/{jobId}",
                    "/api/applications",
                    "/api/files/upload"
            ),
            "PUT", List.of(
                    "/api/candidates/{id}",
                    "/api/candidates/{id}/availability",
                    "/api/candidate-skills/**",
                    "/api/notifications/{id}/read",
                    "/api/notifications/account/{accountId}/read-all",
                    "/api/interviews/{id}/status",
                    "/api/candidates/{candidateId}/work-histories/{workHistoryId}"
            ),
            "DELETE", List.of(
                    "/api/candidate-skills/**",
                    "/api/notifications/{id}",
                    "/api/files/delete/{publicId}",
                    "/api/candidates/{candidateId}/work-histories/{workHistoryId}",
                    "/api/candidates/{candidateId}/saved-jobs/{jobId}"
            )
    );

    //  QUYỀN EMPLOYER
    private static final Map<String, List<String>> EMPLOYER_PERMISSIONS = Map.of(
            "GET", List.of(
                    "/api/candidates/list",
                    "/api/candidates/get-by/{id}",
                    "/api/candidates/get-by-email/{email}",
                    "/api/employers/get-by-email/{email}",
                    "/api/employers/{id}/subscriptions",
                    "/api/employers/{id}/statistics",
                    "/api/candidate-skills/**",
                    "/api/applications/get-by/{id}",
                    "/api/applications/list",
                    "/api/applications/job/{jobId}",
                    "/api/applications/employer/{employerId}/candidates",
                    "/api/applications/employer/{employerId}/accepted-candidates",
                    "/api/subscriptions/**",
                    "/api/invoices/{id}",
                    "/api/invoices/subscription/{subscriptionId}",
                    "/api/invoices/employer/{employerId}",
                    "/api/notifications/account/{accountId}",
                    "/api/notifications/account/{accountId}/unread-count",
                    "/api/interviews/{id}",
                    "/api/interviews/employer/{employerId}",
                    "/api/payments/create-payment/{invoiceId}",
                    "/api/payments/employer/{employerId}/payments",
                    "/api/payments/vnpay-return",
                    "/api/payments/paypal/success",
                    "/api/chatroom/**"
            ),
            "POST", List.of(
                    "/api/jobs",
                    "/api/job-skills",
                    "/api/job-skills/batch/{jobId}",
                    "/api/subscriptions",
                    "/api/interviews",
                    "/api/payments/create-payment",
                    "/api/files/upload",
                    "/api/chatroom/create"
            ),
            "PUT", List.of(
                    "/api/employers/{id}",
                    "/api/jobs/{id}",
                    "/api/job-skills/{id}",
                    "/api/applications/{id}/status",
                    "/api/subscriptions/**",
                    "/api/notifications/{id}/read",
                    "/api/notifications/account/{accountId}/read-all",
                    "/api/interviews/{id}/status"
            ),
            "DELETE", List.of(
                    "/api/jobs/**",
                    "/api/job-skills/{id}",
                    "/api/applications/{id}",
                    "/api/subscriptions/**",
                    "/api/invoices/{id}",
                    "/api/notifications/{id}",
                    "/api/interviews/{id}",
                    "/api/files/delete/{publicId}",
                    "/api/payments/{id}/cancel",
                    "/api/chatroom/**"
            )
    );

    //  QUYỀN ADMIN
    private static final Map<String, List<String>> ADMIN_PERMISSIONS = Map.of(
            "GET", List.of(
                    "/api/roles/**",
                    "/api/candidates/**",
                    "/api/employers/**",
                    "/api/employers/{id}/statistics",
                    "/api/candidate-skills/**",
                    "/api/jobs/**",
                    "/api/job-skills/**",
                    "/api/applications/**",
                    "/api/packages/**",
                    "/api/permissions/**",
                    "/api/package-permissions/**",
                    "/api/subscriptions/**",
                    "/api/invoices/**",
                    "/api/notifications/**",
                    "/api/payments/**"
            ),
            "POST", List.of(
                    "/api/skills",
                    "/api/industries",
                    "/api/professions",
                    "/api/roles/**",
                    "/api/jobs",
                    "/api/job-skills/**",
                    "/api/applications",
                    "/api/packages",
                    "/api/permissions",
                    "/api/package-permissions/**",
                    "/api/subscriptions/**"
            ),
            "PUT", List.of(
                    "/api/skills/{id}",
                    "/api/industries/{id}",
                    "/api/professions/{id}",
                    "/api/candidates/**",
                    "/api/roles/**",
                    "/api/jobs/{id}",
                    "/api/job-skills/**",
                    "/api/applications/**",
                    "/api/packages/**",
                    "/api/permissions/**"
            ),
            "DELETE", List.of(
                    "/api/skills/{id}",
                    "/api/industries/{id}",
                    "/api/professions/{id}",
                    "/api/candidates/{id}",
                    "/api/roles/**",
                    "/api/employers/{id}",
                    "/api/jobs/**",
                    "/api/job-skills/**",
                    "/api/applications/**",
                    "/api/packages/**",
                    "/api/permissions/**",
                    "/api/package-permissions/**",
                    "/api/subscriptions/**",
                    "/api/invoices/**"
            )
    );

    /**
     * Cấu hình AuthenticationManager để quản lý xác thực người dùng
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .authenticationEntryPoint(jwtAuthEntryPoint))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> {
                    PERMIT_ALL_URLS.forEach(url -> auth.requestMatchers(url).permitAll());
                    for (String url : AUTH_WHITELIST) {
                        auth.requestMatchers(url).permitAll();
                    }
                    // User permissions
                    USER_PERMISSIONS.forEach((method, urls) -> urls.forEach(url ->
                            auth.requestMatchers(HttpMethod.valueOf(method), url).hasRole("USER")));
                    // Employer permissions
                    EMPLOYER_PERMISSIONS.forEach((method, urls) -> urls.forEach(url ->
                            auth.requestMatchers(HttpMethod.valueOf(method), url).hasRole("EMPLOYER")));
                    // Admin permissions
                    ADMIN_PERMISSIONS.forEach((method, urls) -> urls.forEach(url ->
                            auth.requestMatchers(HttpMethod.valueOf(method), url).hasRole("ADMIN")));

                    auth.anyRequest().authenticated();
                })
                .oauth2Login(oauth2 -> oauth2
                        .loginPage("/oauth2/authorization/google")
                        .loginPage("/oauth2/authorization/github")
                        .successHandler(oAuth2LoginSuccessHandler)
                        .failureHandler((request, response, exception) -> {
                            System.out.println("OAuth2 Error Details: " + exception.getMessage());
                            exception.printStackTrace();
                            response.setStatus(HttpStatus.UNAUTHORIZED.value());
                            response.getWriter().write("OAuth2 authentication failed: " + exception.getMessage());
                        })
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(oAuthUserService)
                        )
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",
            "http://localhost:8080",
            "ws://http://localhost:8080"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowCredentials(true);
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization", 
            "Content-Type",
            "X-Requested-With",
            "accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        source.registerCorsConfiguration("/ws/**", configuration);
        return source;
    }

}
