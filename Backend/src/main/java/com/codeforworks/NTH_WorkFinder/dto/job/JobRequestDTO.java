package com.codeforworks.NTH_WorkFinder.dto.job;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class JobRequestDTO {
    private String title; 
    private String description;
    private Long employerId;
    private Long professionId; //ngành nghề
    private Long industryId; //lĩnh vực
    private String location; 
    private Long salary; //lương
    private Date expiryDate; //ngày hết hạn
    private String requiredJobLevel; //trình độ (INTERN, FRESHER, JUNIOR, MIDDLE, SENIOR, LEAD, MANAGER)
    private String requiredExperienceLevel; //kinh nghiệm (NO_EXPERIENCE, LESS_THAN_1_YEAR,  ONE_TO_THREE_YEARS, THREE_TO_FIVE_YEARS, b FIVE_TO_TEN_YEARS, MORE_THAN_TEN_YEARS)
    private String requiredEducationLevel; //trình độ (HIGH_SCHOOL, COLLEGE, BACHELOR, MASTER,DOCTORATE,OTHER)
    private String requiredJobType; //loại công việc (full-time, part-time, seasonal)
    private Boolean isFeatured; // Đánh dấu là tin nổi bật
}
