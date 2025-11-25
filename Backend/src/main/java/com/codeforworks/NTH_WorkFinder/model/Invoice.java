package com.codeforworks.NTH_WorkFinder.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "invoice")
public class Invoice extends Base{

    @OneToOne
    @JoinColumn(name = "subscription_id", nullable = false)
    private Subscription subscription;
    
    @Column(nullable = false, unique = true)
    private String invoiceNumber;  // Số hóa đơn duy nhất
    private Double amount;         // Số tiền
    private Date issueDate;        // Ngày phát hành
    
    @Enumerated(EnumType.STRING)
    private InvoiceStatus status;  // PENDING, PAID, CANCELLED
    
    private String description;    // Mô tả hóa đơn
    private String note;           // Ghi chú
    
    @OneToOne(mappedBy = "invoice", cascade = CascadeType.ALL)
    private Payment payment;

    @Column(nullable = false)
    private String code;


    public enum InvoiceStatus {
        PENDING,    // Chờ thanh toán
        PAID,       // Đã thanh toán
        CANCELLED   // Đã hủy
    }
}
