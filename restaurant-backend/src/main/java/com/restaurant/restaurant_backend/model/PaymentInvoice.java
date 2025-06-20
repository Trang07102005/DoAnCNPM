package com.restaurant.restaurant_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import jakarta.persistence.ManyToOne;


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

    @Column(nullable = false)
    private LocalDateTime paidAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "cashierID")
    private Users cashier;

    @Column(length = 255)
    private String note;
}
