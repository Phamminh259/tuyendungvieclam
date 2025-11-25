package com.codeforworks.NTH_WorkFinder.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "role")
public class Role extends Base{

    private String roleName;
    private String description;

    @ManyToMany(mappedBy = "roles")
    @JsonIgnore
    private Set<Account> accounts;
}
