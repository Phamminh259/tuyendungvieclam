package com.codeforworks.NTH_WorkFinder.dto.candidate;

import com.codeforworks.NTH_WorkFinder.model.enums.EducationLevel;
import com.codeforworks.NTH_WorkFinder.model.enums.ExperienceLevel;
import com.codeforworks.NTH_WorkFinder.model.enums.JobLevel;
import com.codeforworks.NTH_WorkFinder.model.enums.JobType;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class CandidateRequestDTO {
    private Long userId;
    private String fullName;
    private String phone;
    private String address;
    private Date birthday;
    private Boolean sex;
    private String location;
    private String avatar;
    private String attachedFile;
    private Double expectedSalary; // Mức lương mong muốn
    private String title; // Vị trí/chức danh mong muốn
    private String description; // Giới thiệu bản thân
    private List<String> certifications; // Chứng chỉ
    private JobType jobType; //FULL_TIME, PART_TIME, SEASONAL
    private JobLevel jobLevel; //INTERN, FRESHER, JUNIOR, MIDDLE, SENIOR, LEAD, MANAGER 
    private ExperienceLevel experienceLevel; //NO_EXPERIENCE, LESS_THAN_1_YEAR, ONE_TO_THREE_YEARS, THREE_TO_FIVE_YEARS, FIVE_TO_TEN_YEARS, MORE_THAN_TEN_YEARS
    private EducationLevel educationLevel; //HIGH_SCHOOL, COLLEGE, UNIVERSITY, POSTGRADUATE, DOCTORATE, OTHER
    private Boolean isAvailable; //trạng thái tìm việc
    private Long industryId; // Id lĩnh vực
    private Long professionId; // Id ngành nghề
}