package com.restaurant.restaurant_backend.controller;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import com.restaurant.restaurant_backend.dto.FoodCountDTO;
import com.restaurant.restaurant_backend.dto.OrderDTO;
import com.restaurant.restaurant_backend.dto.OrderDetailDTO;
import com.restaurant.restaurant_backend.dto.PaymentRequestDTO;
import com.restaurant.restaurant_backend.model.*;
import com.restaurant.restaurant_backend.repository.*;

import lombok.RequiredArgsConstructor;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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

    @GetMapping("/invoice")
public ResponseEntity<ByteArrayResource> generateInvoice(@RequestParam List<Integer> orderIds) throws IOException, DocumentException {
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    Document document = new Document();
    PdfWriter.getInstance(document, baos);
    document.open();

    document.add(new Paragraph("💵 HÓA ĐƠN THANH TOÁN"));
    document.add(new Paragraph("Ngày giờ: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm"))));
    document.add(new Paragraph("----------------------------------------------------"));

    BigDecimal grandTotal = BigDecimal.ZERO;

    for (Integer orderId : orderIds) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        document.add(new Paragraph("🧾 Đơn #" + orderId + " - Bàn: " + 
            (order.getRestaurantTable() != null ? order.getRestaurantTable().getTableName() : "N/A")));

        for (OrderDetail detail : order.getOrderDetails()) {
            BigDecimal itemTotal = detail.getPrice().multiply(BigDecimal.valueOf(detail.getQuantity()));
            String line = String.format("• %s x%d = %,.0f₫", 
                detail.getFood().getFoodName(), 
                detail.getQuantity(), 
                itemTotal.doubleValue());
            document.add(new Paragraph(line));
        }

        document.add(new Paragraph("Tổng đơn: " + String.format("%,.0f₫", order.getTotal().doubleValue())));
        document.add(new Paragraph("----------------------------------------------------"));

        grandTotal = grandTotal.add(order.getTotal());
    }

    document.add(new Paragraph("💰 Tổng thanh toán: " + String.format("%,.0f₫", grandTotal.doubleValue())));
    document.close();

    ByteArrayResource resource = new ByteArrayResource(baos.toByteArray());

    return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=hoa_don.pdf")
            .contentType(MediaType.APPLICATION_PDF)
            .contentLength(resource.contentLength())
            .body(resource);
}

@GetMapping("/revenue-summary")
@PreAuthorize("hasAuthority('ROLE_CASHIER')")
public ResponseEntity<?> getRevenueSummary() {
    List<PaymentInvoice> invoices = paymentInvoiceRepository.findAll();

    BigDecimal total = BigDecimal.ZERO;
    Map<String, BigDecimal> map = new HashMap<>();

    for (PaymentInvoice invoice : invoices) {
        String method = invoice.getPaymentMethod().getMethodName();
        BigDecimal amount = invoice.getPaidAmount();
        map.put(method, map.getOrDefault(method, BigDecimal.ZERO).add(amount));
        total = total.add(amount);
    }

    List<Map<String, Object>> details = map.entrySet().stream()
        .map(entry -> {
            Map<String, Object> item = new HashMap<>();
            item.put("method", entry.getKey());
            item.put("amount", entry.getValue());
            return item;
        })
        .collect(Collectors.toList());

    return ResponseEntity.ok(Map.of(
        "total", total,
        "details", details
    ));
}

@GetMapping("/foods/top")
public ResponseEntity<?> getTopOrderedFoods(@RequestParam(required = false) Integer categoryId) {
    List<Object[]> results;

    if (categoryId != null) {
        results = orderDetailRepository.findFoodOrderCountsByCategory(categoryId);
    } else {
        results = orderDetailRepository.findFoodOrderCounts();
    }

    List<Map<String, Object>> response = results.stream().map(row -> {
        Map<String, Object> item = new HashMap<>();
        item.put("foodName", row[0]);
        item.put("imageUrl", row[1]);
        item.put("totalOrdered", row[2]);
        return item;
    }).collect(Collectors.toList());

    return ResponseEntity.ok(response);
}


    
    
}
