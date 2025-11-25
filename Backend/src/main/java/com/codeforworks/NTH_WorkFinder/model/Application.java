package com.codeforworks.NTH_WorkFinder.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "application")
public class Application extends Base{
    @Column(name = "code", unique = true, nullable = false, updatable = false)
    private String code;
    @ManyToOne
    @JoinColumn(name = "id_job", nullable = false)
    private Job job;

    @ManyToOne
    @JoinColumn(name = "id_candidate", nullable = false)
    private Candidate candidate;

    @OneToMany(mappedBy = "application")
    private List<Interview> interviews; // Danh sách phỏng vấn cho ứng tuyển này

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    public enum ApplicationStatus {
        Pending, //chưa giải quyết
        Accepted, //đã chấp nhận
        Rejected //đã từ chối   
    }
}

