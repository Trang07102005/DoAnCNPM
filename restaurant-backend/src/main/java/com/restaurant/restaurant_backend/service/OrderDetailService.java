package com.restaurant.restaurant_backend.service;

import com.restaurant.restaurant_backend.model.Order;
import com.restaurant.restaurant_backend.model.OrderDetail;
import com.restaurant.restaurant_backend.repository.OrderDetailRepository;
import com.restaurant.restaurant_backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class OrderDetailService {

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private OrderRepository orderRepository;

    // Lấy tất cả
    public List<OrderDetail> getAllOrderDetails() {
        return orderDetailRepository.findAll();
    }

    // Lấy theo ID
    public Optional<OrderDetail> getOrderDetailById(Integer id) {
        return orderDetailRepository.findById(id);
    }

    // Lấy theo OrderID
    public List<OrderDetail> getOrderDetailsByOrderId(Integer orderId) {
        return orderDetailRepository.findByOrder_OrderId(orderId);
    }

    // Lấy theo FoodID
    public List<OrderDetail> getOrderDetailsByFoodId(Integer foodId) {
        return orderDetailRepository.findByFood_FoodId(foodId);
    }

    // Tạo mới chi tiết — chỉ cho phép nếu Order là Draft
    public OrderDetail createOrderDetail(OrderDetail orderDetail) {
        Order order = getValidDraftOrder(orderDetail.getOrder().getOrderId());
        validateQuantity(orderDetail.getQuantity());

        OrderDetail savedDetail = orderDetailRepository.save(orderDetail);
        recalculateOrderTotal(order.getOrderId());
        return savedDetail;
    }

    // Cập nhật chi tiết — chỉ cho phép nếu Order là Draft
    public OrderDetail updateOrderDetail(Integer id, OrderDetail updatedDetail) {
        Order order = getValidDraftOrder(updatedDetail.getOrder().getOrderId());
        validateQuantity(updatedDetail.getQuantity());

        updatedDetail.setOrderDetailId(id);
        OrderDetail savedDetail = orderDetailRepository.save(updatedDetail);
        recalculateOrderTotal(order.getOrderId());
        return savedDetail;
    }

    // Xoá chi tiết — chỉ cho phép nếu Order là Draft
    public void deleteOrderDetail(Integer id) {
        Optional<OrderDetail> detailOpt = orderDetailRepository.findById(id);
        if (detailOpt.isPresent()) {
            Order order = getValidDraftOrder(detailOpt.get().getOrder().getOrderId());
            orderDetailRepository.deleteById(id);
            recalculateOrderTotal(order.getOrderId());
        } else {
            throw new RuntimeException("OrderDetail not found with ID: " + id);
        }
    }

    // ==============================
    // Validate số lượng
    private void validateQuantity(Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero!");
        }
    }

    // ==============================
    // Tính lại tổng tiền
    private void recalculateOrderTotal(Integer orderId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            List<OrderDetail> details = orderDetailRepository.findByOrder_OrderId(orderId);

            BigDecimal total = BigDecimal.ZERO;
            for (OrderDetail detail : details) {
                total = total.add(detail.getPrice().multiply(BigDecimal.valueOf(detail.getQuantity())));
            }

            order.setTotal(total);
            orderRepository.save(order);
        }
    }

    // ==============================
    // Chỉ cho phép chỉnh chi tiết nếu Order là Draft
    private Order getValidDraftOrder(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
        if (!"Draft".equalsIgnoreCase(order.getStatus())) {
            throw new UnsupportedOperationException("Cannot modify order detail because Order is already placed or confirmed!");
        }
        return order;
    }
}
