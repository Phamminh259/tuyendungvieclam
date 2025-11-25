package com.codeforworks.NTH_WorkFinder.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "interview")
public class Interview extends Base{

    @Column(name = "code", unique = true, nullable = false, updatable = false)
    private String code;

    @ManyToOne
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    private String title;

    @Column(nullable = false)
    private LocalDate interviewDate;

    @Column(nullable = false)
    private LocalTime interviewTime;

    @Enumerated(EnumType.STRING)
        private InterviewType type;

    private String location; // địa điểm phỏng vấn hoặc link meeting
    private String note;

    @Enumerated(EnumType.STRING)
    private InterviewStatus status;

    public enum InterviewType {
        ONLINE,
        OFFLINE
    }

    public enum InterviewStatus {
        SCHEDULED,  // Đã lên lịch
        COMPLETED,  // Đã hoàn thành 
        CANCELLED   // Đã hủy
    }
}
