package com.codeforworks.NTH_WorkFinder.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

import com.codeforworks.NTH_WorkFinder.model.enums.EducationLevel;
import com.codeforworks.NTH_WorkFinder.model.enums.ExperienceLevel;
import com.codeforworks.NTH_WorkFinder.model.enums.JobLevel;
import com.codeforworks.NTH_WorkFinder.model.enums.JobType;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "candidate")
public class Candidate extends Base{
    @Column(name = "code", unique = true, nullable = false, updatable = false)
    private String code;

    @PrePersist
    public void prePersist() {
        if (this.code == null) {
            long timestamp = System.currentTimeMillis();
            this.code = "CAND-" + timestamp;
        }
    }

    @OneToOne
    @JoinColumn(name = "id_user", nullable = false)
    private User user;

    private String phone;
    private String address;
    private Date birthday;
    private Boolean sex;
    private String location;
    private String avatar;
    private String attachedFile; // File đính kèm
    private Boolean isAvailable; //trạng thái tìm việc

    private String title;           // Vị trí/chức danh mong muốn
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;     // Giới thiệu bản thân
    private Double expectedSalary;  // Mức lương mong muốn
    private Date lastActive;        // Thời gian hoạt động gần nhất

    @OneToMany(mappedBy = "candidate")
    private List<Application> applications;// Danh sách đơn ứng tuyển của ứng viên


    @OneToMany(mappedBy = "candidate")
    private List<CandidateSkill> candidateSkills;// Các kỹ năng và mức độ thành thạo của ứng viên


    @ElementCollection
    @CollectionTable(name = "candidate_certifications")
    private List<String> certifications; // Chứng chỉ
    
    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL)
    private List<WorkHistory> workHistories; // Lịch sử làm việc

    @ManyToOne
    @JoinColumn(name = "industry_id")
    private Industry industry;

    @ManyToOne
    @JoinColumn(name = "profession_id")
    private Profession profession;

    @ManyToMany
    @JoinTable(
        name = "candidate_saved_jobs",
        joinColumns = @JoinColumn(name = "candidate_id"),
        inverseJoinColumns = @JoinColumn(name = "job_id")
    )
    private List<Job> savedJobs; // Danh sách job đã lưu

    @Enumerated(EnumType.STRING)
    private JobType jobType; //loại công việc

    @Enumerated(EnumType.STRING)
    private JobLevel jobLevel;

    @Enumerated(EnumType.STRING)
    private ExperienceLevel experienceLevel;

    @Enumerated(EnumType.STRING)
    private EducationLevel educationLevel;


}
