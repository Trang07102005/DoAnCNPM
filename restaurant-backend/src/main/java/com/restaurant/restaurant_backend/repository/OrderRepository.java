package com.restaurant.restaurant_backend.repository;

import com.restaurant.restaurant_backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer>, JpaSpecificationExecutor<Order> {

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

   

    @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    List<Object[]> countOrdersByStatus();

    @Query("SELECT SUM(o.total) FROM Order o")
    Double sumTotalRevenue();

    // Đếm đơn theo ngày
@Query("SELECT FUNCTION('DATE', o.orderTime), COUNT(o) FROM Order o GROUP BY FUNCTION('DATE', o.orderTime) ORDER BY FUNCTION('DATE', o.orderTime)")
List<Object[]> countOrdersByDay();

// Đếm đơn theo tháng
@Query("SELECT FUNCTION('MONTH', o.orderTime), COUNT(o) FROM Order o GROUP BY FUNCTION('MONTH', o.orderTime) ORDER BY FUNCTION('MONTH', o.orderTime)")
List<Object[]> countOrdersByMonth();

// Đếm đơn theo năm
@Query("SELECT FUNCTION('YEAR', o.orderTime), COUNT(o) FROM Order o GROUP BY FUNCTION('YEAR', o.orderTime) ORDER BY FUNCTION('YEAR', o.orderTime)")
List<Object[]> countOrdersByYear();


@Query("SELECT DATE(o.orderTime) as orderDay, SUM(o.total) FROM Order o GROUP BY DATE(o.orderTime) ORDER BY orderDay ASC")
List<Object[]> sumRevenueByDay();


@Query("SELECT FUNCTION('DATE_FORMAT', o.orderTime, '%Y-%m') as orderMonth, SUM(o.total) FROM Order o GROUP BY orderMonth ORDER BY orderMonth ASC")
List<Object[]> sumRevenueByMonth();


@Query("SELECT YEAR(o.orderTime) as orderYear, SUM(o.total) FROM Order o GROUP BY orderYear ORDER BY orderYear ASC")
List<Object[]> sumRevenueByYear();
List<Order> findByRestaurantTable_TableIdAndStatusInOrderByOrderTimeDesc(Integer tableId, List<String> status);

@Query("SELECT AVG(o.total) FROM Order o WHERE o.total IS NOT NULL")
Double findAverageOrderValue();
    

}
