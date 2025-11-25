package com.codeforworks.NTH_WorkFinder.dto.employer;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

import com.codeforworks.NTH_WorkFinder.dto.job.TopJobDTO;

import java.util.List;

@Data
@NoArgsConstructor
// DTO thống kê của nhà tuyển dụng
public class EmployerStatisticsDTO {
    private int totalJobs;
    private int activeJobs;
    private int totalApplications;
    private int successfulHires;
    private double averageResponseTime; // Thời gian phản hồi trung bình
    private Map<String, Integer> popularJobCategories; // Thống kê theo ngành nghề
    private Map<String, Integer> applicationsByMonth; // Thống kê theo tháng
    private int totalViews; // Lượt xem hồ sơ
    private double responseRate; // Tỷ lệ phản hồi
    private List<TopJobDTO> topPerformingJobs; // Top công việc có nhiều ứng tuyển
} 