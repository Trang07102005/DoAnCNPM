package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.model.*;
import com.restaurant.restaurant_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class PaymentInvoiceController {

    private final PaymentInvoiceRepository paymentInvoiceRepository;
    private final OrderRepository orderRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final UserRepository userRepository;

    // ✅ Tạo hóa đơn thanh toán
    @PostMapping
    public ResponseEntity<?> createPayment(@RequestParam Integer orderId,
                                           @RequestParam Integer cashierId,
                                           @RequestParam Integer paymentMethodId,
                                           @RequestParam(required = false) String note) {

        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null || !"Đang xử lý".equals(order.getStatus())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Đơn hàng không hợp lệ hoặc đã thanh toán");
        }

        PaymentMethod method = paymentMethodRepository.findById(paymentMethodId).orElse(null);
        Users cashier = userRepository.findById(cashierId).orElse(null);

        if (method == null || cashier == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Thông tin thanh toán không hợp lệ");
        }

        PaymentInvoice invoice = PaymentInvoice.builder()
                .order(order)
                .paymentMethod(method)
                .cashier(cashier)
                .paidAmount(order.getTotal())
                .note(note)
                .paidAt(LocalDateTime.now())
                .status(PaymentInvoice.InvoiceStatus.FINALIZED)
                .build();

        paymentInvoiceRepository.save(invoice);

        // ✅ Đánh dấu đơn đã thanh toán & giải phóng bàn
        order.setStatus("Đã thanh toán");
        orderRepository.save(order);

        RestaurantTable table = order.getRestaurantTable();
        if (table != null) {
            table.setStatus("Trống");
        }

        return ResponseEntity.ok("Thanh toán thành công");
    }

    // ✅ Lấy danh sách hóa đơn
    @GetMapping
    public List<PaymentInvoice> getAllPayments() {
        return paymentInvoiceRepository.findAll();
    }

    @GetMapping("/{id}")
public ResponseEntity<?> getPayment(@PathVariable Integer id) {
    return paymentInvoiceRepository.findById(id)
            .<ResponseEntity<?>>map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy hóa đơn"));
}


}
