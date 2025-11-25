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
@Table(name = "payment")
public class Payment extends Base{

    @OneToOne
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    @ManyToOne
    @JoinColumn(name = "subscription_id", nullable = false)
    private Subscription subscription;
    
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;  // MOMO, VNPAY, BANK_TRANSFER
    
    private Double amount;
    private Date paymentDate;
    private String transactionId;         // Mã giao dịch từ cổng thanh toán
    
    @Enumerated(EnumType.STRING)
    private PaymentStatus status;         // PENDING, SUCCESS, FAILED
    
    private String paymentInfo;           // Thông tin thanh toán bổ sung

    public enum PaymentMethod {
        MOMO,
        VNPAY,
        PAYPAL
    }
    
    public enum PaymentStatus {
        PENDING,    // Đang xử lý
        SUCCESS,    // Thành công
        FAILED      // Thất bại
    }
}
