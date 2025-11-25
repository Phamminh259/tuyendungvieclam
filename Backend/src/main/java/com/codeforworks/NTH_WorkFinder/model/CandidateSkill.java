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
@Table(name = "candidate_skill")
public class CandidateSkill extends Base{

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Enumerated(EnumType.STRING)
    private ProficiencyLevel proficiencyLevel; // Mức độ thành thạo của kỹ năng
    public enum ProficiencyLevel {
        BEGINNER,//NGƯỜI MỚI BẮT ĐẦU
        INTERMEDIATE,//TRUNG CẤP
        ADVANCED,// TRÌNH ĐỘ CAO
        EXPERT  //CHUYÊN GIA
    }
}
