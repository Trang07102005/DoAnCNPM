package com.restaurant.restaurant_backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.FetchType;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orderdetail")
public class OrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrderDetailID")
    private Integer orderDetailId;

    @ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "OrderID")
@JsonBackReference
private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "FoodID")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Food food;

    @Column(name = "Quantity", nullable = false)
    private Integer quantity;

    @Column(name = "Price", nullable = false)
    private BigDecimal price;

    @Override
public String toString() {
    return "OrderDetail{" +
           "orderDetailId=" + orderDetailId +
           ", quantity=" + quantity +
           ", price=" + price +
           '}';
}
}