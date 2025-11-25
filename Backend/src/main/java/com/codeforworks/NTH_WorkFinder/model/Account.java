package com.codeforworks.NTH_WorkFinder.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "account")
public class Account extends Base{

    @Email(message = "Email phải hợp lệ")
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_type")
    private AccountType accountType;

    private Boolean status = false; // Chưa xác thực

    private Boolean loggedIn = false; // Chưa đăng nhập lần đầu


    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "account_role",
            joinColumns = @JoinColumn(name = "account_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>(); // Quyền của tài khoản

    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private User user;

    @OneToOne(mappedBy = "account")
    @JsonIgnore
    private Admin admin;

    @OneToOne(mappedBy = "account")
    @JsonIgnore
    private Employer employer;

    public enum AccountType {
        USER,
        ADMIN,
        EMPLOYER
    }
}
