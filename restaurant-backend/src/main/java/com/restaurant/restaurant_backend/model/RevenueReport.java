package com.restaurant.restaurant_backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate; // Dùng LocalDate cho DATE
import java.time.LocalDateTime;

@Entity
@Table(name = "revenuereport")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RevenueReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ReportID")
    private Integer reportId;

    @Column(name = "ReportDate", nullable = false)
    private LocalDate reportDate;

    @Column(name = "TotalRevenue", nullable = false)
    private BigDecimal totalRevenue;

    @Column(name = "TotalOrders", nullable = false)
    private Integer totalOrders;

    @Column(name = "ReportGeneratedAt")
    private LocalDateTime reportGeneratedAt;
}