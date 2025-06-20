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
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "topsellingfood")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopSellingFood {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TopFoodID")
    private Integer topFoodId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "FoodID")
    private Food food;

    @Column(name = "TotalSold", nullable = false)
    private Integer totalSold;

    @Column(name = "ReportDate", nullable = false)
    private LocalDate reportDate;

    @Column(name = "GeneratedAt")
    private LocalDateTime generatedAt;
}