package com.codeforworks.NTH_WorkFinder.dto.application;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class ApplicationRequestDTO {
    private Long jobId;
    private Long candidateId;
    private String status; // (Pending, Accepted, Rejected)
}