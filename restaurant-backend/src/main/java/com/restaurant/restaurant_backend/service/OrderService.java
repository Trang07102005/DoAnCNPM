package com.restaurant.restaurant_backend.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.restaurant.restaurant_backend.dto.MonthlyRevenueDTO;
import com.restaurant.restaurant_backend.repository.OrderRepository;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

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

}
