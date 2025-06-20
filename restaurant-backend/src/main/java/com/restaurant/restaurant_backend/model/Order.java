package com.restaurant.restaurant_backend.model;

import jakarta.persistence.CascadeType; // Để dùng CascadeType
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany; // Để dùng OneToMany
import jakarta.persistence.Table; // <-- Quan trọng
import jakarta.persistence.FetchType;
import com.restaurant.restaurant_backend.model.RestaurantTable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List; // Để dùng List
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "`order`") // Rất quan trọng: Sử dụng dấu backtick
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order { // Tên lớp không cần dấu backtick

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrderID")
    private Integer orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TableID")
    private RestaurantTable restaurantTable;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CreatedBy")
    private Users createdBy; // Người tạo đơn (User)

    @Column(name = "OrderTime")
    private LocalDateTime orderTime;

    @Column(name = "Status")
    private String status; // 'Đang xử lý', 'Đã thanh toán', 'Đã hủy'

    @Column(name = "Total")
    private BigDecimal total;

    // Mối quan hệ One-to-Many với OrderDetail (Một đơn hàng có nhiều chi tiết đơn hàng)
    // mappedBy: chỉ ra tên thuộc tính trong OrderDetail mà quản lý mối quan hệ này (order)
    // cascade = CascadeType.ALL: Khi thao tác với Order, các OrderDetail liên quan cũng bị ảnh hưởng (ví dụ: xóa Order cũng xóa OrderDetail)
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderDetail> orderDetails;

    // Mối quan hệ One-to-Many với OrderStatus (Một đơn hàng có nhiều trạng thái món ăn)
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderStatus> orderStatuses;
}