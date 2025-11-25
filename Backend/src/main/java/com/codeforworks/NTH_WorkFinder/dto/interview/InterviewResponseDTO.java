package com.codeforworks.NTH_WorkFinder.dto.interview;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Data
public class InterviewResponseDTO {
    private Long id;
    private String code;
    private Long applicationId;
    private String title;
    private LocalDate interviewDate;
    private LocalTime interviewTime;
    private String type;
    private String location;
    private String note;
    private String status;
    private LocalDateTime createdDate;
} 