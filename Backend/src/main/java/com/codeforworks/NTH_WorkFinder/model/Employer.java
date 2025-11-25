package com.codeforworks.NTH_WorkFinder.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "employer")
public class Employer extends Base{

    @Column(name = "code", unique = true, nullable = false, updatable = false)
    private String code;

    @OneToOne
    @JoinColumn(name = "id_account", nullable = false)
    private Account account;

    @ManyToOne
    @JoinColumn(name = "id_industry")
    private Industry industry; // lĩnh vực công ty
    
    private String contactName;
    private String contactPhone;
    private String contactEmail;
    private String contactPosition; //chức vụ người liên hệ

    @Column(name = "company_name", length = 45)
    private String companyName;

    private String companyAddress;
    private String companyWebsite;
    private String companyPhone;
    @Column(name = "company_description", columnDefinition = "TEXT")
    private String companyDescription;
    private String location; // địa điểm công ty
    private String companyLogo; // logo công ty
    private String companySize; // số lượng nhân sự
    private String taxCode; // mã số thuế
    private String businessLicense; // giấy phép kinh doanh (định dạng file) 


    @OneToMany(mappedBy = "employer")
    private List<Job> jobs; // việc làm

    @OneToMany(mappedBy = "employer", fetch = FetchType.EAGER)
    private Set<Subscription> subscriptions; // gói đăng ký

    @Enumerated(EnumType.STRING)
    private EmployerStatus status; // trạng thái công ty 


    public enum EmployerStatus {
        ACTIVE, // hoạt động
        INACTIVE, // chưa hoạt động (đang chờ xác thực)
        SUSPENDED // tạm ngưng
    }
}


