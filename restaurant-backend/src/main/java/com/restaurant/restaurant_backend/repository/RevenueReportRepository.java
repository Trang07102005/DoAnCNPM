package com.restaurant.restaurant_backend.repository;

import com.restaurant.restaurant_backend.model.RevenueReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface RevenueReportRepository extends JpaRepository<RevenueReport, Integer> {
    Optional<RevenueReport> findByReportDate(LocalDate reportDate); // Tìm báo cáo theo ngày
}