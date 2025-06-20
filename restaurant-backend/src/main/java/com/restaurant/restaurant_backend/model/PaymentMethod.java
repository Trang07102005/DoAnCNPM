package com.restaurant.restaurant_backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payment_method")
@Data // @Getter, @Setter, @ToString, @EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer paymentMethodID;

    @Column(nullable = false, unique = true, length = 50)
    private String methodName;

    @Column(length = 255)
    private String note;
}
