package com.codeforworks.NTH_WorkFinder.dto.auth.register;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmployerRegisterDTO {
    // Thông tin đăng nhập
    @Email(message = "Email không hợp lệ")
    private String email;
    private String password;
    private String confirmPassword;
    
    // Thông tin công ty
    @NotBlank(message = "Tên công ty không được để trống")
    private String companyName;
    @Pattern(regexp = "\\d{10,11}", message = "Số điện thoại công ty không hợp lệ")
    private String companyPhone;
    @NotBlank(message = "Địa chỉ công ty không được để trống")
    private String companyAddress;
    private String location;
    
    // Thông tin người liên hệ
    @NotBlank(message = "Tên người đại diện không được để trống")
    private String contactName;
    @Pattern(regexp = "\\d{10,11}", message = "Số điện thoại người đại diện không hợp lệ") 
    private String contactPhone;
    @Email(message = "Email liên hệ không hợp lệ")
    private String contactPosition;

    private String industry; // Tên ngành nghề
}
