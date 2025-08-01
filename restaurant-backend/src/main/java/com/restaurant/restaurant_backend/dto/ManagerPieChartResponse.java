package com.restaurant.restaurant_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ManagerPieChartResponse {
    private Map<String, Long> orderStatus;
    private Map<String, Long> foodStatus;
    private Map<String, Long> userRoles;
}
