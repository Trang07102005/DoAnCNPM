package com.restaurant.restaurant_backend.model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_invoice")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentInvoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer invoiceID;

    @ManyToOne
    @JoinColumn(name = "OrderID", nullable = false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "paymentMethodID", nullable = false)
    private PaymentMethod paymentMethod;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal paidAmount;

    @Builder.Default
    @Column(nullable = false)
    private LocalDateTime paidAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "cashierID")
    private Users cashier;

    @Column(length = 255)
    private String note;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false, length = 20)
    private InvoiceStatus status = InvoiceStatus.DRAFT;

    
    public static enum InvoiceStatus {
        DRAFT,
        FINALIZED
    }
}
