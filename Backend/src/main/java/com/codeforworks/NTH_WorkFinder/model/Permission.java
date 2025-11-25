package com.codeforworks.NTH_WorkFinder.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "permission")
public class Permission extends Base{

    @Column(unique = true)
    private String permissionKey;
    
    private String permissionName;
    private String description;
    private boolean active;

    @OneToMany(mappedBy = "permission")
    private Set<PackagePermission> packagePermissions;
}
