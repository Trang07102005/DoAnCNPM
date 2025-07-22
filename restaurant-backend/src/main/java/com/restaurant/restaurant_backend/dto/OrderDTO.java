package com.restaurant.restaurant_backend.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDTO {
    private Integer orderId;
    private String status;
    private LocalDateTime orderTime;
    private BigDecimal total;
    private String customerName;
    private Integer numberOfGuests;
    private String note;
    private Integer tableId;

    // ✅ Thêm trường tableName ở đây:
    private String tableName;

    private List<OrderDetailDTO> orderDetails;
}
