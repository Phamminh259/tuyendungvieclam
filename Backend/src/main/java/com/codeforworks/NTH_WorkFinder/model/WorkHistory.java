package com.codeforworks.NTH_WorkFinder.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "work_history")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class WorkHistory extends Base {
    @ManyToOne
    @JoinColumn(name = "candidate_id")
    private Candidate candidate;
    
    private String companyName; // Tên công ty  
    private String position; // Vị trí
    private Date startDate; // Ngày bắt đầu
    private Date endDate; // Ngày kết thúc
    @Column(name = "description", columnDefinition = "TEXT")
    private String description; // Mô tả
    private Boolean isCurrentJob; // Công việc hiện tại
} 