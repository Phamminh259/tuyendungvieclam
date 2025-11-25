package com.codeforworks.NTH_WorkFinder.model;

import com.codeforworks.NTH_WorkFinder.model.enums.EducationLevel;
import com.codeforworks.NTH_WorkFinder.model.enums.ExperienceLevel;
import com.codeforworks.NTH_WorkFinder.model.enums.JobLevel;
import com.codeforworks.NTH_WorkFinder.model.enums.JobType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "job")
public class Job extends Base {
    @Column(name = "code", unique = true, nullable = false, updatable = false)
    private String code;

    @ManyToOne
    @JoinColumn(name = "id_employer", nullable = false)
    private Employer employer;

    @ManyToOne
    @JoinColumn(name = "id_profession")
    private Profession profession;

    @ManyToOne
    @JoinColumn(name = "id_industry")
    private Industry industry;

    private String title;
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    private String location;
    private Long salary;
    private Date expiryDate;
    private boolean isActive; //trạng thái công việc
    private Long viewCount; //số lượt xem
    private Long applicationCount; //số lượt ứng tuyển
    private Boolean approved = false; // Mặc định là chưa được duyệt
    private boolean isFeatured; // Đánh dấu là tin nổi bật

    @OneToMany(mappedBy = "job")
    private List<JobSkill> jobSkills;

    @OneToMany(mappedBy = "job")
    private List<Application> applications;

    @ManyToOne
    @JoinColumn(name = "subscription_id")
    private Subscription subscription; // Liên kết với gói đăng ký

    @Enumerated(EnumType.STRING)
    private JobType requiredJobType; //loại công việc

    @Enumerated(EnumType.STRING)
    private JobLevel requiredJobLevel; // Cấp bậc công việc yêu cầu

    @Enumerated(EnumType.STRING)
    private ExperienceLevel requiredExperienceLevel; // Yêu cầu kinh nghiệm

    @Enumerated(EnumType.STRING)
    private EducationLevel requiredEducationLevel; // Yêu cầu bằng cấp


}
