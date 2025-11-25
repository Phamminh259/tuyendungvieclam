package com.codeforworks.NTH_WorkFinder.dto.application;

import com.codeforworks.NTH_WorkFinder.dto.interview.InterviewResponseDTO;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Data
public class ApplicationWithInterviewDTO {
    private Long id;
    private String jobTitle;
    private String status;
    private Date createdDate;
    private InterviewResponseDTO interview;
}