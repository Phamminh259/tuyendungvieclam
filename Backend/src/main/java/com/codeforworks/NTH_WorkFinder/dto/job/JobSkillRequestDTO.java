package com.codeforworks.NTH_WorkFinder.dto.job;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JobSkillRequestDTO {
    private Long jobId;
    private Long skillId;
    private String proficiencyLevel; // (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT: người mới, trung bình, nâng cao, chuyên gia)
    private String description; // Thêm mô tả yêu cầu cụ thể cho kỹ năng
    private Boolean isRequired; // Thêm trường để đánh dấu kỹ năng bắt buộc hay không
}
