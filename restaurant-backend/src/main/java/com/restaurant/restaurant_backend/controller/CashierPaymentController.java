    package com.restaurant.restaurant_backend.controller;

    import com.restaurant.restaurant_backend.dto.OrderDTO;
    import com.restaurant.restaurant_backend.dto.OrderDetailDTO;
    import com.restaurant.restaurant_backend.model.*;
    import com.restaurant.restaurant_backend.repository.*;
    import lombok.RequiredArgsConstructor;
    import org.springframework.http.*;
    import org.springframework.security.access.prepost.PreAuthorize;
    import org.springframework.transaction.annotation.Transactional;
    import org.springframework.web.bind.annotation.*;

    import java.math.BigDecimal;
    import java.time.LocalDateTime;
    import java.util.List;

    @RestController
    @RequestMapping("/api/cashier")
    @CrossOrigin(origins = "http://localhost:5173")
    @RequiredArgsConstructor
    public class CashierPaymentController {

        private final OrderRepository orderRepository;
        private final PaymentInvoiceRepository paymentInvoiceRepository;
        private final PaymentMethodRepository paymentMethodRepository;
        private final RestaurantTableRepository tableRepository;

        // ✅ Lấy các hóa đơn chưa thanh toán (đã sửa: trả về DTO tránh lỗi Lazy loading)
        @PreAuthorize("hasAuthority('ROLE_CASHIER')")
        @GetMapping("/pending-orders")
        public ResponseEntity<List<OrderDTO>> getPendingOrders() {
            List<Order> pendingOrders = orderRepository.findByStatus("Đang xử lý");
            List<OrderDTO> dtos = pendingOrders.stream().map(this::convertToDTO).toList();
            return ResponseEntity.ok(dtos);
        }

        // ✅ Lấy danh sách phương thức thanh toán (đã thêm mới)
        @PreAuthorize("hasAuthority('ROLE_CASHIER')")
        @GetMapping("/payment-methods")
        public ResponseEntity<List<PaymentMethod>> getAllPaymentMethods() {
            List<PaymentMethod> methods = paymentMethodRepository.findAll();
            return ResponseEntity.ok(methods);
        }

        // ✅ Xử lý thanh toán (đã đúng sẵn)
        @PreAuthorize("hasAuthority('ROLE_CASHIER')")
        @Transactional
        @PostMapping("/pay-orders")
        public ResponseEntity<?> payOrders(
                @RequestParam List<Integer> orderIds,
                @RequestParam Integer methodId,
                @RequestParam Integer cashierId,
                @RequestParam(required = false) String note
        ) {
            PaymentMethod method = paymentMethodRepository.findById(methodId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phương thức thanh toán"));

            BigDecimal totalAmount = BigDecimal.ZERO;

            for (Integer orderId : orderIds) {
                Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

                order.setStatus("Đã thanh toán");
                orderRepository.save(order);

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

                // Reset trạng thái bàn
                RestaurantTable table = order.getRestaurantTable();
                if (table != null) {
                    table.setStatus("Trống");
                    tableRepository.save(table);
                }
            }

            return ResponseEntity.ok("Thanh toán thành công. Tổng tiền: " + totalAmount);
        }

        @GetMapping("/order-details/by-order/{orderId}")
public ResponseEntity<List<OrderDetailDTO>> getOrderDetailsByOrder(@PathVariable Integer orderId) {
    Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

    List<OrderDetailDTO> detailDTOs = order.getOrderDetails().stream()
            .filter(detail -> detail.getFood() != null)
            .map(detail -> {
                OrderDetailDTO d = new OrderDetailDTO();
                d.setOrderDetailId(detail.getOrderDetailId()); // ✅ Thêm dòng này
                d.setFoodId(detail.getFood().getFoodId());
                d.setFoodName(detail.getFood().getFoodName());
                d.setPrice(detail.getPrice());
                d.setQuantity(detail.getQuantity());
                return d;
            }).toList();

    return ResponseEntity.ok(detailDTOs);
}


        // ✅ giữ nguyên convertToDTO() cũ
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
                    }).toList();

            dto.setOrderDetails(detailDTOs);
            return dto;
        }
        
    }