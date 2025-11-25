package com.codeforworks.NTH_WorkFinder.model;

import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "user")
public class User extends Base{

    @OneToOne(cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @JoinColumn(name = "id_account", nullable = false)
    private Account account;

    @Column(name = "full_name", length = 45)
    private String fullName;

    private String phone;

    @OneToOne(mappedBy = "user")
    private Candidate candidate;

}
