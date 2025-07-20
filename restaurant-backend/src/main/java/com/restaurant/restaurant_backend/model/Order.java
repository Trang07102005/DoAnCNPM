package com.restaurant.restaurant_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "`order`")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrderID")
    private Integer orderId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "TableID")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "orders", "reservations"})
    private RestaurantTable restaurantTable;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CreatedBy")
    private Users createdBy;

    @Column(name = "OrderTime")
    private LocalDateTime orderTime;

    @Column(name = "Status")
    private String status;

    @Column(name = "Total")
    private BigDecimal total;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<OrderDetail> orderDetails;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<OrderStatus> orderStatuses;

    @Override
    public String toString() {
        return "Order{" +
                "orderId=" + orderId +
                ", orderTime=" + orderTime +
                ", status='" + status + '\'' +
                ", total=" + total +
                '}';
    }
}

