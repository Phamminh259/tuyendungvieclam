package com.codeforworks.NTH_WorkFinder.dto.interview;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
@Data
public class InterviewRequestDTO {
    private Long applicationId;  // ID của đơn ứng tuyển
    private String title;        // Tiêu đề cuộc phỏng vấn
    private LocalDate interviewDate;      // Ngày phỏng vấn
    private LocalTime interviewTime;      // Thời gian phỏng vấn
    private String type;         // Hình thức (Trực tiếp/Online)
    private String location;     // Địa điểm (có thể là địa chỉ thực hoặc link meeting)
    private String note;         // Ghi chú
} 