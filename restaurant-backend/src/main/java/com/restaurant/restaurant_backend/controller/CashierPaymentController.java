package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.dto.OrderDTO;
import com.restaurant.restaurant_backend.dto.OrderDetailDTO;
import com.restaurant.restaurant_backend.dto.PaymentRequestDTO;
import com.restaurant.restaurant_backend.model.*;
import com.restaurant.restaurant_backend.repository.*;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cashier")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class CashierPaymentController {

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final PaymentInvoiceRepository paymentInvoiceRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final RestaurantTableRepository tableRepository;

    /**
     * ✅ API: Lấy danh sách đơn hàng đang chờ thanh toán
     */
    @PreAuthorize("hasAuthority('ROLE_CASHIER')")
    @GetMapping("/pending-orders")
    public ResponseEntity<List<OrderDTO>> getPendingOrders() {
        List<Order> pendingOrders = orderRepository.findByStatus("Đang xử lý");
        List<OrderDTO> dtos = pendingOrders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * ✅ API: Lấy danh sách phương thức thanh toán
     */
    @PreAuthorize("hasAuthority('ROLE_CASHIER')")
    @GetMapping("/payment-methods")
    public ResponseEntity<List<PaymentMethod>> getAllPaymentMethods() {
        List<PaymentMethod> methods = paymentMethodRepository.findAll();
        return ResponseEntity.ok(methods);
    }

    /**
     * ✅ API: Thanh toán nhiều đơn hàng
     */
    @PreAuthorize("hasAuthority('ROLE_CASHIER')")
    @Transactional
    @PostMapping("/pay-orders")
    public ResponseEntity<?> payOrders(@RequestBody PaymentRequestDTO request) {
        List<Integer> orderIds = request.getOrderIds();
        Integer methodId = request.getMethodId();
        Integer cashierId = request.getCashierId();
        String note = request.getNote();

        PaymentMethod method = paymentMethodRepository.findById(methodId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phương thức thanh toán"));

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (Integer orderId : orderIds) {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        
            // ✅ TÍNH LẠI TỔNG TRƯỚC KHI LƯU
            recalculateOrderTotal(order);
        
            // ✅ Đánh dấu đơn đã thanh toán
            order.setStatus("Đã thanh toán");
            orderRepository.save(order);

            // Ghi thông tin phiếu thanh toán
            Users cashier = new Users();
            cashier.setUserId(cashierId);

            PaymentInvoice invoice = PaymentInvoice.builder()
                    .order(order)
                    .paymentMethod(method)
                    .paidAmount(order.getTotal())
                    .cashier(cashier)
                    .note(note)
                    .status(PaymentInvoice.InvoiceStatus.FINALIZED)
                    .paidAt(LocalDateTime.now())
                    .build();

            paymentInvoiceRepository.save(invoice);
            totalAmount = totalAmount.add(order.getTotal());

            // Reset trạng thái bàn về "Trống"
            RestaurantTable table = order.getRestaurantTable();
            if (table != null) {
                table.setStatus("Trống");
                tableRepository.save(table);
            }
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "Thanh toán thành công. Tổng tiền: " + totalAmount);
        return ResponseEntity.ok(response);
    }

    /**
     * ✅ API: Lấy chi tiết món ăn trong 1 đơn hàng
     */
    @PreAuthorize("hasAuthority('ROLE_CASHIER')")
    @GetMapping("/order-details/by-order/{orderId}")
    public ResponseEntity<List<OrderDetailDTO>> getOrderDetailsByOrder(@PathVariable Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        List<OrderDetailDTO> detailDTOs = order.getOrderDetails().stream()
                .filter(detail -> detail.getFood() != null)
                .map(detail -> {
                    OrderDetailDTO dto = new OrderDetailDTO();
                    dto.setOrderDetailId(detail.getOrderDetailId());
                    dto.setFoodId(detail.getFood().getFoodId());
                    dto.setFoodName(detail.getFood().getFoodName());
                    dto.setPrice(detail.getPrice());
                    dto.setQuantity(detail.getQuantity());
                    return dto;
                }).collect(Collectors.toList());

        return ResponseEntity.ok(detailDTOs);
    }

    /**
     * ✅ Helper: Chuyển đổi Order thành DTO để trả về frontend
     */
    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setOrderId(order.getOrderId());
        dto.setStatus(order.getStatus());
        dto.setOrderTime(order.getOrderTime());
        dto.setTotal(order.getTotal());

        if (order.getRestaurantTable() != null) {
            dto.setTableId(order.getRestaurantTable().getTableId());
            dto.setTableName(order.getRestaurantTable().getTableName());
        }

        List<OrderDetailDTO> detailDTOs = order.getOrderDetails().stream()
                .filter(detail -> detail.getFood() != null)
                .map(detail -> {
                    OrderDetailDTO d = new OrderDetailDTO();
                    d.setFoodId(detail.getFood().getFoodId());
                    d.setFoodName(detail.getFood().getFoodName());
                    d.setPrice(detail.getPrice());
                    d.setQuantity(detail.getQuantity());
                    return d;
                }).collect(Collectors.toList());

        dto.setOrderDetails(detailDTOs);
        return dto;
    }

    private void recalculateOrderTotal(Order order) {
        List<OrderDetail> details = orderDetailRepository.findByOrder(order);
        if (details == null || details.isEmpty()) {
            order.setTotal(BigDecimal.ZERO);
            return;
        }
    
        BigDecimal total = details.stream()
                .map(detail -> detail.getPrice().multiply(BigDecimal.valueOf(detail.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    
        order.setTotal(total);
    }
    
    
}
