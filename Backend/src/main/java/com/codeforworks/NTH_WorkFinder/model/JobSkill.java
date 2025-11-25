package com.codeforworks.NTH_WorkFinder.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "job_skill")
public class JobSkill extends Base{

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Enumerated(EnumType.STRING)
    private ProficiencyLevel proficiencyLevel;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    private Boolean isRequired;

    public enum ProficiencyLevel {   //Mức độ thành thạo kỹ năng cho công việc này
        BEGINNER,
        INTERMEDIATE,
        ADVANCED,
        EXPERT
    }
}
