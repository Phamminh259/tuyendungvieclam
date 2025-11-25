package com.codeforworks.NTH_WorkFinder.security.jwt;

import com.codeforworks.NTH_WorkFinder.security.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    /**
     * jwtTokenProvider: Đối tượng này chịu trách nhiệm tạo và xác minh JWT. Nó chứa các phương thức như validateToken và getUsernameFromToken.
     * customUserDetailsService: Dùng để tải thông tin người dùng từ cơ sở dữ liệu dựa trên username được lấy từ token.
     */
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // Lấy JWT từ cookie
        String token = getJwtFromCookie(request);
         if (token == null) {
             token = request.getHeader("Authorization");
             if (token != null && token.startsWith("Bearer ")) {
                 token = token.substring(7);
             }
         }

        // Kiểm tra tính hợp lệ của token
        if (token != null && jwtTokenProvider.validateToken(token)) {
            // Lấy username từ token
            String username = jwtTokenProvider.getUsernameFromToken(token);

            // Lấy thông tin người dùng từ username
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);

            // Tạo đối tượng Authentication mới và đặt vào SecurityContext
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            // Đặt Authentication vào SecurityContext
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        // Tiếp tục chuỗi lọc
        filterChain.doFilter(request, response);
    }

    /**
     * Lấy JWT từ cookie "jwtToken" trong yêu cầu
     * @return JWT token dưới dạng chuỗi, hoặc null nếu không có
     */
    private String getJwtFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwtToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
