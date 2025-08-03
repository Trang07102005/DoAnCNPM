package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.model.Order;
import com.restaurant.restaurant_backend.model.OrderStatus;
import com.restaurant.restaurant_backend.model.PaymentInvoice;
import com.restaurant.restaurant_backend.model.PaymentMethod;
import com.restaurant.restaurant_backend.model.Users;
import com.restaurant.restaurant_backend.repository.OrderRepository;
import com.restaurant.restaurant_backend.repository.OrderStatusRepository;
import com.restaurant.restaurant_backend.repository.PaymentInvoiceRepository;
import com.restaurant.restaurant_backend.repository.PaymentMethodRepository;
import com.restaurant.restaurant_backend.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/cashier")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentInvoiceController {

    private final OrderRepository orderRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final PaymentInvoiceRepository paymentInvoiceRepository;
    private final RestaurantTableRepository tableRepository;
    private final OrderStatusRepository orderStatusRepository;
    
    @PostMapping("/pay")
    public ResponseEntity<?> payOrder(
            @RequestParam Integer orderId,
            @RequestParam Integer methodId,
            @RequestParam Integer cashierId,
            @RequestParam(required = false) String note
    ) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return ResponseEntity.badRequest().body("❌ Không tìm thấy đơn hàng");
        }

        PaymentMethod method = paymentMethodRepository.findById(methodId).orElse(null);
        if (method == null) {
            return ResponseEntity.badRequest().body("❌ Phương thức thanh toán không hợp lệ");
        }

        // ✅ Dùng repository để đảm bảo lấy đúng dữ liệu
        List<OrderStatus> statuses = orderStatusRepository.findByOrder_OrderId(orderId);
        boolean allCompleted = statuses.stream()
            .allMatch(s -> "Đã hoàn thành".equalsIgnoreCase(s.getStatus()));

        if (!allCompleted) {
            return ResponseEntity.badRequest()
                .body("❌ Không thể thanh toán: Một số món trong đơn chưa hoàn thành.");
        }

        PaymentInvoice invoice = PaymentInvoice.builder()
                .order(order)
                .paymentMethod(method)
                .paidAmount(order.getTotal())
                .paidAt(LocalDateTime.now())
                .cashier(new Users(cashierId))
                .note(note)
                .status(PaymentInvoice.InvoiceStatus.FINALIZED)
                .build();

        paymentInvoiceRepository.save(invoice);

        order.setStatus("Đã thanh toán");
        orderRepository.save(order);

        if (order.getRestaurantTable() != null) {
            order.getRestaurantTable().setStatus("Trống");
            tableRepository.save(order.getRestaurantTable());
        }

        return ResponseEntity.ok("✅ Thanh toán thành công");
    }

}
