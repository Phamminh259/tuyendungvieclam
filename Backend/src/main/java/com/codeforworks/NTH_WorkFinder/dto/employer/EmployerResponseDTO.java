package com.codeforworks.NTH_WorkFinder.dto.employer;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class EmployerResponseDTO {
    private Long id;
    private String companyName;
    private String companyAddress;
    private String companyPhone;
    private String companyWebsite;
    private String companyDescription;
    private String location;
    
    // Thông tin người liên hệ
    private String contactName;
    private String contactPhone;
    private String contactEmail;
    private String contactPosition; // Chức vụ liên hệ
    
    private String industryName; // Tên lĩnh vực
    
    // Thông tin bổ sung về công ty
    private String companySize;
    private String companyLogo;
    private List<String> companyImages;
    private String taxCode; // Mã số thuế   
    private String businessLicense;// Giấy phép kinh doanh
    
    // Trạng thái
    private boolean isVerified;  // Đã xác thực
    private String status;       // ACTIVE, INACTIVE, SUSPENDED
    private int totalJobs;       // Tổng số việc làm đã đăng
    private int activeJobs;     // Số việc làm đang tuyển
}