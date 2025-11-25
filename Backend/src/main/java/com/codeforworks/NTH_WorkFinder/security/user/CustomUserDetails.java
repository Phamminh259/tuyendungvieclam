package com.codeforworks.NTH_WorkFinder.security.user;

import com.codeforworks.NTH_WorkFinder.model.Account;
import com.codeforworks.NTH_WorkFinder.model.Employer;
import com.codeforworks.NTH_WorkFinder.model.PackagePermission;
import com.codeforworks.NTH_WorkFinder.model.Subscription;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class CustomUserDetails implements UserDetails {

    private Account account;

    public CustomUserDetails(Account account) {
        this.account = account;
    }

    public Account getAccount() {
        return account;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> authorities = new ArrayList<>();

        // Thêm quyền dựa trên Role
        authorities.addAll(account.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getRoleName()))
                .collect(Collectors.toList()));

        // Kiểm tra và xử lý các gói dịch vụ của Employer
        if (account.getEmployer() != null) {
            account.getEmployer().getSubscriptions().stream()
                    .filter(Subscription::getIsActive)
                    .flatMap(subscription -> subscription.getPackageEntity().getPackagePermissions().stream())
                    .filter(PackagePermission::getIsActive)
                    .map(permission -> new SimpleGrantedAuthority(permission.getPermission().getPermissionName()))
                    .forEach(authorities::add);
        }

        return authorities;
    }

    @Override
    public String getPassword() {
        return account.getPassword(); // Lấy mật khẩu đã mã hóa từ Account
    }

    @Override
    public String getUsername() {
        return account.getEmail(); // Lấy email làm định danh người dùng
    }

    @Override
    public boolean isAccountNonExpired() { //Tài khoản không hết hạn
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {  //Tài khoản không bị khóa
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {  //Thông tin xác thực không hết hạn
        return true;
    }

    @Override
    public boolean isEnabled() {
        return account.getStatus(); // Trả về trạng thái của tài khoản
    }


}
