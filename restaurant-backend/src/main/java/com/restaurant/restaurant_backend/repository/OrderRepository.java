package com.restaurant.restaurant_backend.repository;

import com.restaurant.restaurant_backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    // Tìm các đơn theo ID bàn
    List<Order> findByRestaurantTable_TableId(Integer tableId);

    // Tìm các đơn theo trạng thái
    List<Order> findByStatus(String status);

    // Tìm đơn theo khoảng thời gian
    List<Order> findByOrderTimeBetween(LocalDateTime startTime, LocalDateTime endTime);

    // Tìm đơn theo ID người tạo
    List<Order> findByCreatedBy_UserId(Integer userId);

    // Tổng doanh thu tất cả đơn
    @Query("SELECT COALESCE(SUM(o.total), 0) FROM Order o")
    Double sumTotal();

    // Tổng đơn theo tháng (JPQL)
    @Query("SELECT COUNT(o) FROM Order o WHERE MONTH(o.orderTime) = :month")
    int countByMonth(@Param("month") int month);

    // Tổng doanh thu theo tháng (JPQL)
    @Query("SELECT COALESCE(SUM(o.total), 0) FROM Order o WHERE MONTH(o.orderTime) = :month")
    double sumRevenueByMonth(@Param("month") int month);

    // Doanh thu từng tháng (Native SQL) - cho biểu đồ
    @Query(value = "SELECT MONTH(order_time) AS month, SUM(total) AS revenue " +
                   "FROM `order` " +
                   "GROUP BY MONTH(order_time)", nativeQuery = true)
    List<Object[]> getMonthlyRevenue();

    // Số đơn theo từng tháng (JPQL)
    @Query("SELECT MONTH(o.orderTime), COUNT(o) FROM Order o GROUP BY MONTH(o.orderTime)")
    List<Object[]> countOrdersByMonth();

    @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    List<Object[]> countOrdersByStatus();

    @Query("SELECT SUM(o.total) FROM Order o")
    Double sumTotalRevenue();

}
