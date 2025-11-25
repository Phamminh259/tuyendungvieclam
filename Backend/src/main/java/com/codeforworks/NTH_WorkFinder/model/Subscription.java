package com.codeforworks.NTH_WorkFinder.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "subscriptions")
public class Subscription extends Base{

    @ManyToOne
    @JoinColumn(name = "employer_id", nullable = false)
    private Employer employer;

    @ManyToOne
    @JoinColumn(name = "package_id", nullable = false)
    private Package packageEntity;

    @Column(name = "start_date")
    private Date startDate;

    @Column(name = "end_date")
    private Date endDate;

    @Column(name = "is_active")
    private Boolean isActive;

    @OneToMany(mappedBy = "subscription")
    private List<Payment> payments  = new ArrayList<>(); // Mối quan hệ 1-nhiều với Payment

    @OneToOne(mappedBy = "subscription", cascade = CascadeType.ALL)
    private Invoice invoice;

    public boolean getIsActive() {
        return this.isActive; // Cung cấp phương thức công khai để truy cập
    }
}
