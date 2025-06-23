package com.restaurant.restaurant_backend.service;

import com.restaurant.restaurant_backend.model.RevenueReport;
import com.restaurant.restaurant_backend.repository.RevenueReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RevenueReportService {

    private final RevenueReportRepository reportRepository;

    //  Lấy tất cả báo cáo
    public List<RevenueReport> getAllReports() {
        return reportRepository.findAll();
    }

    //  Lấy báo cáo theo ngày
    public RevenueReport getReportByDate(LocalDate date) {
        return reportRepository.findByReportDate(date)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy báo cáo cho ngày: " + date));
    }

    //  Tạo mới hoặc cập nhật lại báo cáo cho 1 ngày
    public RevenueReport generateOrUpdateReport(LocalDate date, BigDecimal totalRevenue, Integer totalOrders) {
        if (totalRevenue.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Tổng doanh thu không được âm!");
        }
        if (totalOrders < 0) {
            throw new RuntimeException("Tổng số đơn hàng không được âm!");
        }

        RevenueReport report = reportRepository.findByReportDate(date)
                .orElse(new RevenueReport());

        report.setReportDate(date);
        report.setTotalRevenue(totalRevenue);
        report.setTotalOrders(totalOrders);
        report.setReportGeneratedAt(LocalDateTime.now());

        return reportRepository.save(report);
    }

    //  Xóa báo cáo (nếu thực sự cần)
    public void deleteReport(Integer id) {
        if (!reportRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy báo cáo để xoá!");
        }
        reportRepository.deleteById(id);
    }
}
