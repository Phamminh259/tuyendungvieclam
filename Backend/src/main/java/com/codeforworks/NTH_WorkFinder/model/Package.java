package com.codeforworks.NTH_WorkFinder.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;
import java.util.HashSet;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "package")
public class Package extends Base{

    private String packageName;

    @Column(nullable = false)
    private Integer duration; // Thời hạn của gói tính theo số ngày

    private Double price;

    @OneToMany(mappedBy = "packageEntity", fetch = FetchType.EAGER)
    private Set<PackagePermission> packagePermissions = new HashSet<>();

    @OneToMany(mappedBy = "packageEntity")
    private Set<Subscription> subscriptions;

}
