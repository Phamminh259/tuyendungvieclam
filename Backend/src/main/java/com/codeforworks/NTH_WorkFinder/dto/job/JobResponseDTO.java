package com.codeforworks.NTH_WorkFinder.dto.job;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class JobResponseDTO {
    private Long id;
    private String code;
    private String title;
    private String description;
    private Long companyId;
    private String employerName;
    private String professionName;
    private String industryName;
    private String location;
    private Long salary;
    private Date expiryDate;
    private String requiredJobLevel; //INTERN, FRESHER, JUNIOR, MIDDLE, SENIOR, LEAD, MANAGER
    private String requiredExperienceLevel; //NO_EXPERIENCE, LESS_THAN_1_YEAR, ONE_TO_THREE_YEARS, THREE_TO_FIVE_YEARS, FIVE_TO_TEN_YEARS, MORE_THAN_TEN_YEARS
    private String requiredEducationLevel; //HIGH_SCHOOL, COLLEGE, UNIVERSITY, POSTGRADUATE, DOCTORATE, OTHER
    private String requiredJobType; //FULL_TIME, PART_TIME, SEASONAL
    private String companyName;
    private String companyLogo;
    private Date createdDate; 
    private Boolean isActive; //trạng thái công việc
    private Long viewCount; //số lượt xem
    private Long applicationCount; //số lượt ứng tuyển
    private List<JobSkillResponseDTO> skills; //danh sách các kỹ năng yêu cầu
    private Boolean approved;
    private String contactEmail;
    private String companyPhone;
    private Boolean isFeatured; // Đánh dấu là tin nổi bật
    
}
