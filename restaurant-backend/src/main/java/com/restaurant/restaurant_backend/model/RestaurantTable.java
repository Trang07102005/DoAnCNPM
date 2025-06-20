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

@Entity
@Table(name = "`restauranttable`") // Rất quan trọng: Sử dụng dấu backtick để ánh xạ đúng với tên bảng có từ khóa SQL
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantTable  { // Tên lớp không cần dấu backtick

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TableID")
    private Integer tableId;

    @Column(name = "TableName", nullable = false)
    private String tableName;

    @Column(name = "Status")
    private String status; // 'Trống', 'Đã đặt', 'Đang phục vụ'
}