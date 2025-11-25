package com.codeforworks.NTH_WorkFinder.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatbotRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "pattern", columnDefinition = "TEXT")
    private String pattern; // Pattern để match câu hỏi

    @Column(name = "response", columnDefinition = "TEXT")
    private String response; // Câu trả lời

    private String category; // Phân loại câu hỏi (vd: job, company, candidate...)

    private Integer priority; // Độ ưu tiên của rule
} 