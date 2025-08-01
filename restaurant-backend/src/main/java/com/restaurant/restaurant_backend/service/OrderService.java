package com.restaurant.restaurant_backend.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.criteria.Predicate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.restaurant.restaurant_backend.dto.MonthlyRevenueDTO;
import com.restaurant.restaurant_backend.dto.OrderChartDTO;
import com.restaurant.restaurant_backend.model.Order;
import com.restaurant.restaurant_backend.model.PaymentInvoice;
import com.restaurant.restaurant_backend.repository.OrderRepository;
import com.restaurant.restaurant_backend.repository.PaymentInvoiceRepository;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private PaymentInvoiceRepository invoiceRepository;

public List<MonthlyRevenueDTO> getMonthlyRevenue() {
    List<Object[]> results = orderRepository.getMonthlyRevenue();
    List<MonthlyRevenueDTO> revenueList = new ArrayList<>();
    
    for (Object[] row : results) {
        int month = ((Integer) row[0]);
        double revenue = ((BigDecimal) row[1]).doubleValue();
        revenueList.add(new MonthlyRevenueDTO(month, revenue));
    }
    
    return revenueList;
}

public List<Order> filterOrders(String status, LocalDate date) {
    System.out.println("Filter params: status=" + status + ", date=" + date);
    
    List<Order> orders = orderRepository.findAll((root, query, cb) -> {
        List<Predicate> predicates = new ArrayList<>();

        // Lọc theo status nếu có
        if (status != null && !status.isEmpty()) {
            predicates.add(cb.equal(root.get("status"), status));
        }

        // Lọc theo ngày nếu có
        if (date != null) {
            LocalDateTime startOfDay = date.atStartOfDay();
            LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();
            predicates.add(cb.between(root.get("orderTime"), startOfDay, endOfDay));
        }

        return cb.and(predicates.toArray(new Predicate[0]));
    });

    System.out.println("Filtered orders count: " + orders.size());
    return orders;
}






public List<OrderChartDTO> getOrderCountByDay() {
    List<Object[]> results = orderRepository.countOrdersByDay();
    List<OrderChartDTO> dtoList = new ArrayList<>();
    for (Object[] row : results) {
        String date = row[0].toString(); // ví dụ: 2025-07-29
        int count = ((Number) row[1]).intValue();
        dtoList.add(new OrderChartDTO(date, count));
    }
    return dtoList;
}

public List<OrderChartDTO> getOrderCountByMonth() {
    List<Object[]> results = orderRepository.countOrdersByMonth();
    List<OrderChartDTO> dtoList = new ArrayList<>();
    for (Object[] row : results) {
        String month = String.format("%02d", row[0]); // ví dụ: "07"
        int count = ((Number) row[1]).intValue();
        dtoList.add(new OrderChartDTO(month, count));
    }
    return dtoList;
}

public List<OrderChartDTO> getOrderCountByYear() {
    List<Object[]> results = orderRepository.countOrdersByYear();
    List<OrderChartDTO> dtoList = new ArrayList<>();
    for (Object[] row : results) {
        String year = row[0].toString(); // ví dụ: "2025"
        int count = ((Number) row[1]).intValue();
        dtoList.add(new OrderChartDTO(year, count));
    }
    return dtoList;
}

// Method tạo Order mới, đồng thời tạo PaymentInvoice DRAFT kèm theo
    public Order createOrder(Order order) {
        // Lưu order
        Order savedOrder = orderRepository.save(order);

        // Tạo hóa đơn tạm với trạng thái DRAFT, chưa thanh toán
        PaymentInvoice draftInvoice = PaymentInvoice.builder()
            .order(savedOrder)
            .paymentMethod(null) // Có thể để null hoặc một phương thức mặc định
            .paidAmount(BigDecimal.ZERO) // hoặc null tùy bạn
            .paidAt(null) // Chưa thanh toán, chưa có thời gian
            .cashier(null)
            .note("Hóa đơn tạm tạo cùng order, chưa thanh toán")
            .status(PaymentInvoice.InvoiceStatus.DRAFT)
            .build();

        invoiceRepository.save(draftInvoice);

        return savedOrder;
    }



}
