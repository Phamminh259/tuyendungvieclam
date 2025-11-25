package com.codeforworks.NTH_WorkFinder.dto.job;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
// DTO top công việc có nhiều ứng tuyển
public class TopJobDTO {
    private Long jobId;
    private String title;
    private int totalApplications;
    private double responseRate;
    private int views;
} 