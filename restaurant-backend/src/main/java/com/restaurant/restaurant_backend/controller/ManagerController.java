package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.dto.OrderDTO;
import com.restaurant.restaurant_backend.dto.OrderDetailDTO;
import com.restaurant.restaurant_backend.model.Order;
import com.restaurant.restaurant_backend.model.PaymentMethod;
import com.restaurant.restaurant_backend.model.Users;
import com.restaurant.restaurant_backend.repository.OrderRepository;
import com.restaurant.restaurant_backend.repository.PaymentMethodRepository;
import com.restaurant.restaurant_backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/manager")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('MANAGER')") // ✅ Bảo vệ toàn bộ controller bằng role
public class ManagerController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/orders")
public ResponseEntity<List<OrderDTO>> getAllOrderDTOs() {
    List<Order> orders = orderRepository.findAll();

    List<OrderDTO> dtos = orders.stream().map(order -> {
        OrderDTO dto = new OrderDTO();

        dto.setOrderId(order.getOrderId());
        dto.setStatus(order.getStatus());
        dto.setOrderTime(order.getOrderTime());
        dto.setTotal(order.getTotal());

        // Nếu Order entity không có customerName, numberOfGuests, note thì bỏ hoặc xử lý null
        // dto.setCustomerName(order.getCustomerName()); // chỉ dùng nếu có getter trong entity
        // dto.setNumberOfGuests(order.getNumberOfGuests());
        // dto.setNote(order.getNote());

        if (order.getRestaurantTable() != null) {
            dto.setTableId(order.getRestaurantTable().getTableId());
            dto.setTableName(order.getRestaurantTable().getTableName());
        } else {
            dto.setTableId(null);
            dto.setTableName(null);
        }

        if (order.getCreatedBy() != null) {
            dto.setCreatedById(order.getCreatedBy().getUserId());
        } else {
            dto.setCreatedById(null);
        }

        // Chuyển orderDetails sang DTO
        if (order.getOrderDetails() != null) {
            List<OrderDetailDTO> detailDTOs = order.getOrderDetails().stream().map(detail -> {
                OrderDetailDTO detailDTO = new OrderDetailDTO();
                detailDTO.setOrderDetailId(detail.getOrderDetailId());
                if (detail.getFood() != null) {
                    detailDTO.setFoodId(detail.getFood().getFoodId());
                    detailDTO.setFoodName(detail.getFood().getFoodName());
                    detailDTO.setImageUrl(detail.getFood().getImageUrl());
                }
                detailDTO.setPrice(detail.getPrice());
                detailDTO.setQuantity(detail.getQuantity());
                detailDTO.setOrderId(order.getOrderId());
                if (detail.getPrice() != null && detail.getQuantity() != null) {
                    detailDTO.setTotal(detail.getPrice().multiply(new java.math.BigDecimal(detail.getQuantity())));
                } else {
                    detailDTO.setTotal(null);
                }
                return detailDTO;
            }).collect(Collectors.toList());
            dto.setOrderDetails(detailDTOs);
        } else {
            dto.setOrderDetails(List.of());
        }

        return dto;
    }).collect(Collectors.toList());

    return ResponseEntity.ok(dtos);
}


    // GET /api/manager/payment-methods
    @GetMapping("/payment-methods")
    public ResponseEntity<List<PaymentMethod>> getAllPaymentMethods() {
        List<PaymentMethod> methods = paymentMethodRepository.findAll();
        return ResponseEntity.ok(methods);
    }

    // GET /api/manager/users?role=staff
    @GetMapping("/users")
    public ResponseEntity<List<Users>> getUsersByRole(@RequestParam(name = "role") String roleName) {
        List<Users> users = userRepository.findByRole_Name(roleName);
        return ResponseEntity.ok(users);
    }
    

    
}
