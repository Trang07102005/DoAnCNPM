package com.restaurant.restaurant_backend.model;
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
    @JoinColumn(name = "paymentMethodID", nullable = true) // Cho phép null khi chưa chọn phương thức
    private PaymentMethod paymentMethod;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal paidAmount;

    @Column(nullable = true)  // Cho phép null vì hóa đơn draft chưa thanh toán
    private LocalDateTime paidAt;

    // Bỏ @PrePersist vì không nên tự động gán paidAt nếu là draft

    @ManyToOne
    @JoinColumn(name = "cashierID", nullable = true)
    private Users cashier;

    @Column(length = 255)
    private String note;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private InvoiceStatus status = InvoiceStatus.DRAFT;

    public static enum InvoiceStatus {
        DRAFT,
        FINALIZED
    }
}

