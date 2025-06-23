package com.restaurant.restaurant_backend.service;

import com.restaurant.restaurant_backend.model.Order;
import com.restaurant.restaurant_backend.model.OrderDetail;
import com.restaurant.restaurant_backend.repository.OrderDetailRepository;
import com.restaurant.restaurant_backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderDetailService {

    private final OrderDetailRepository orderDetailRepository;
    private final OrderRepository orderRepository;

    // Lấy tất cả
    public List<OrderDetail> getAllOrderDetails() {
        return orderDetailRepository.findAll();
    }

    public List<OrderDetail> getOrderDetailsByOrderId(Integer orderId) {
        return orderDetailRepository.findByOrder_OrderId(orderId);
    }

    public List<OrderDetail> getOrderDetailsByFoodId(Integer foodId) {
        return orderDetailRepository.findByFood_FoodId(foodId);
    }

    public OrderDetail getOrderDetailById(Integer id) {
        return orderDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chi tiết đơn hàng với ID: " + id));
    }

    // Tạo mới chi tiết và tính lại total
    public OrderDetail createOrderDetail(OrderDetail orderDetail) {
        var order = orderDetail.getOrder();
        if (order == null || order.getOrderId() == null) {
            throw new RuntimeException("Chi tiết đơn hàng phải thuộc về một đơn hàng hợp lệ.");
        }

        Order parentOrder = orderRepository.findById(order.getOrderId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + order.getOrderId()));

        if (!"Chờ xác nhận".equalsIgnoreCase(parentOrder.getStatus())) {
            throw new RuntimeException("Chỉ được thêm chi tiết khi đơn hàng đang ở trạng thái 'Chờ xác nhận'. Hiện tại: " + parentOrder.getStatus());
        }

        orderDetail.setOrderDetailId(null);
        OrderDetail savedDetail = orderDetailRepository.save(orderDetail);

        // Tính lại total
        recalculateOrderTotal(parentOrder);

        return savedDetail;
    }

    // Cập nhật chi tiết và tính lại total
    public OrderDetail updateOrderDetail(Integer id, OrderDetail updated) {
        OrderDetail existing = getOrderDetailById(id);

        Order parentOrder = existing.getOrder();
        if (!"Chờ xác nhận".equalsIgnoreCase(parentOrder.getStatus())) {
            throw new RuntimeException("Chỉ được chỉnh sửa chi tiết khi đơn hàng đang ở trạng thái 'Chờ xác nhận'. Hiện tại: " + parentOrder.getStatus());
        }

        existing.setFood(updated.getFood());
        existing.setQuantity(updated.getQuantity());
        existing.setPrice(updated.getPrice());

        OrderDetail savedDetail = orderDetailRepository.save(existing);

        // Tính lại total
        recalculateOrderTotal(parentOrder);

        return savedDetail;
    }

    // Xoá chi tiết và tính lại total
    public void deleteOrderDetail(Integer id) {
        OrderDetail existing = getOrderDetailById(id);

        Order parentOrder = existing.getOrder();
        if (!"Chờ xác nhận".equalsIgnoreCase(parentOrder.getStatus())) {
            throw new RuntimeException("Chỉ được xoá chi tiết khi đơn hàng đang ở trạng thái 'Chờ xác nhận'. Hiện tại: " + parentOrder.getStatus());
        }

        orderDetailRepository.deleteById(id);

        // Tính lại total
        recalculateOrderTotal(parentOrder);
    }

    // Hàm hỗ trợ: Tính lại tổng tiền đơn hàng
    private void recalculateOrderTotal(Order order) {
        List<OrderDetail> details = orderDetailRepository.findByOrder_OrderId(order.getOrderId());

        BigDecimal total = details.stream()
                .map(d -> d.getPrice().multiply(BigDecimal.valueOf(d.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotal(total);
        orderRepository.save(order);
    }
}
