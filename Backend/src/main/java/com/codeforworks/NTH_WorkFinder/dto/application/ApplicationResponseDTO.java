package com.codeforworks.NTH_WorkFinder.dto.application;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Data
public class ApplicationResponseDTO {
    private Long id;
    private String code;
    private Long jobId;
    private String jobTitle;
    private Long candidateId;
    private String candidateName;
    private String status;
    private Date createdDate;
    private Date updatedDate;
}
