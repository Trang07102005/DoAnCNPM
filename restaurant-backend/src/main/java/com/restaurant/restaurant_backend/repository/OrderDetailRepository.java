package com.restaurant.restaurant_backend.repository;

import com.restaurant.restaurant_backend.model.Order;
import com.restaurant.restaurant_backend.model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    List<OrderDetail> findByOrder_OrderId(Integer orderId); // Tìm chi tiết đơn hàng theo Order ID
    List<OrderDetail> findByFood_FoodId(Integer foodId); // Tìm chi tiết đơn hàng theo Food ID
    List<OrderDetail> findByOrder(Order order);
    @Query("SELECT od.food.foodName, od.food.imageUrl, SUM(od.quantity) " +
       "FROM OrderDetail od GROUP BY od.food.foodName, od.food.imageUrl " +
       "ORDER BY SUM(od.quantity) DESC")
List<Object[]> findFoodOrderCounts();
@Query("""
    SELECT f.foodName, f.imageUrl, SUM(od.quantity) AS totalOrdered
    FROM OrderDetail od
    JOIN od.food f
    WHERE f.category.categoryId = :categoryId
    GROUP BY f.foodName, f.imageUrl
    ORDER BY totalOrdered DESC
""")
List<Object[]> findFoodOrderCountsByCategory(@Param("categoryId") Integer categoryId);


}
