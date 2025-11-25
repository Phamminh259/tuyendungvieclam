package com.codeforworks.NTH_WorkFinder.dto.candidate;

import com.codeforworks.NTH_WorkFinder.dto.application.ApplicationWithInterviewDTO;
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
public class CandidateProfileDTO {
    private Long id;
    private String code;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private Date birthday;
    private Boolean sex;
    private String location; //địa điểm làm việc
    private String avatar; //ảnh đại diện
    private String attachedFile; //file đính kèm
    private List<String> certifications; //chứng chỉ
    private List<WorkHistoryDTO> workHistory; //lịch sử làm việc
    private List<ApplicationWithInterviewDTO> applications; //ứng tuyển
    private List<CandidateSkillResponseDTO> candidateSkills; //kỹ năng
    private String title; //vị trí/chức danh mong muốn
    private String description;
    private Double expectedSalary; //mức lương mong muốn
    private Date lastActive; //ngày hoạt động
    private Boolean isAvailable; //trạng thái tìm việc
    private String industryName; //lĩnh vực
    private String professionName; //ngành nghề
    private JobType jobType; //FULL_TIME, PART_TIME, SEASONAL
    private JobLevel jobLevel; //INTERN, FRESHER, JUNIOR, MIDDLE, SENIOR, LEAD, MANAGER 
    private ExperienceLevel experienceLevel; //NO_EXPERIENCE, LESS_THAN_1_YEAR, ONE_TO_THREE_YEARS, THREE_TO_FIVE_YEARS, FIVE_TO_TEN_YEARS, MORE_THAN_TEN_YEARS
    private EducationLevel educationLevel; //HIGH_SCHOOL, COLLEGE, UNIVERSITY, POSTGRADUATE, DOCTORATE, OTHER
    private Date createdDate; //ngày tạo
    private Date updatedDate; //ngày cập nhật
}
