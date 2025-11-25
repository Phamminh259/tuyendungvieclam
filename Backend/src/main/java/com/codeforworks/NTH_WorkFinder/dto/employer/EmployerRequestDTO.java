package com.codeforworks.NTH_WorkFinder.dto.employer;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;
import java.util.List;


@Getter
@Setter
public class EmployerRequestDTO {
    @NotBlank(message = "Tên công ty không được để trống")
    private String companyName;
    
    @NotBlank(message = "Địa chỉ công ty không được để trống")
    private String companyAddress;
    
    @Pattern(regexp = "\\d{10,11}", message = "Số điện thoại công ty không hợp lệ")
    private String companyPhone;
    
    @URL(message = "Website không hợp lệ")
    private String companyWebsite;

    private String companyDescription;

    private String location;
    
    @NotBlank(message = "Tên người đại diện không được để trống")
    private String contactName;
    
    @Pattern(regexp = "\\d{10,11}", message = "Số điện thoại người đại diện không hợp lệ")
    private String contactPhone;
    
    @Email(message = "Email không hợp lệ")
    private String contactEmail;
    
    private String contactPosition; // Chức vụ người đại diện

    @NotNull(message = "Ngành nghề không được để trống")
    private Long industryId;

    private String companySize; // Quy mô công ty

    private String companyLogo; // Logo công ty
    
    private List<String> companyImages; // Ảnh về công ty
    
    private String taxCode; // Mã số thuế
    
    private String businessLicense; // Giấy phép kinh doanh
}