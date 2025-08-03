package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.dto.PendingDishDTO;
import com.restaurant.restaurant_backend.model.*;
import com.restaurant.restaurant_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/order-status")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class OrderStatusController {

    private final OrderStatusRepository orderStatusRepository;
    private final RecipeDetailRepository recipeDetailRepository;
    private final IngredientRepository ingredientRepository;
    private final RecipeRepository recipeRepository; // Thêm RecipeRepository

    @GetMapping("/pending")
    public List<PendingDishDTO> getPendingDishes() {
        return orderStatusRepository.findAll().stream()
            .map(os -> new PendingDishDTO(
                os.getOrderStatusId(),
                os.getFood().getFoodName(),
                os.getOrder().getOrderId(),
                os.getStatus(),
                os.getUpdatedAt(),
                os.getFood().getImageUrl(),
                os.getOrder().getRestaurantTable().getTableName(),
                os.getFood().getFoodId()
            ))
            .toList();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDishStatus(@PathVariable Integer id, @RequestParam String status) {
        Optional<OrderStatus> statusOpt = orderStatusRepository.findById(id);
        if (statusOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy món trong đơn");
        }

        OrderStatus orderStatus = statusOpt.get();
        String currentStatus = orderStatus.getStatus();

        // Kiểm tra trạng thái hợp lệ
        if (currentStatus.equals("Đang chế biến") || currentStatus.equals("Đã hoàn thành")) {
            if (status.equals("Chưa chế biến") || status.equals("Đã hủy")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Không thể đổi trạng thái thành 'Chưa chế biến' hoặc 'Đã hủy' khi đã 'Đang chế biến' hoặc 'Đã hoàn thành'");
            }
        }
        if (currentStatus.equals("Đã hoàn thành") || currentStatus.equals("Đã hủy")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Trạng thái 'Đã hoàn thành' hoặc 'Đã hủy' không thể thay đổi");
        }

        orderStatus.setStatus(status);
        orderStatus.setUpdatedAt(LocalDateTime.now());
        orderStatusRepository.save(orderStatus);

        // Kiểm tra và trừ nguyên liệu nếu trạng thái thay đổi thành "Đang chế biến" hoặc "Đã hoàn thành"
        if (("Đang chế biến".equals(status) || "Đã hoàn thành".equals(status)) &&
            !("Đang chế biến".equals(currentStatus) || "Đã hoàn thành".equals(currentStatus))) {
            updateIngredientStock(orderStatus.getOrder(), orderStatus.getFood());
        }

        return ResponseEntity.ok("Cập nhật trạng thái thành công");
    }

    private void updateIngredientStock(Order order, Food food) {
        // Lấy OrderDetail liên quan đến Order và Food cụ thể
        Optional<OrderDetail> orderDetailOpt = order.getOrderDetails().stream()
            .filter(detail -> detail.getFood().getFoodId().equals(food.getFoodId()))
            .findFirst();

        if (orderDetailOpt.isPresent()) {
            OrderDetail detail = orderDetailOpt.get();
            int quantity = detail.getQuantity();

            // Lấy Recipe dựa trên FoodId bằng RecipeRepository
            Recipe recipe = recipeRepository.findByFood_FoodId(food.getFoodId());
            if (recipe != null) {
                List<RecipeDetail> recipeDetails = recipeDetailRepository.findByRecipe_RecipeId(recipe.getRecipeId());
                if (recipeDetails != null) {
                    for (RecipeDetail rd : recipeDetails) {
                        Ingredient ingredient = rd.getIngredient();
                        if (ingredient != null) {
                            BigDecimal requiredQuantity = rd.getQuantity().multiply(BigDecimal.valueOf(quantity));
                            BigDecimal currentStock = ingredient.getQuantityInStock();
                            if (currentStock.compareTo(requiredQuantity) >= 0) {
                                ingredient.setQuantityInStock(currentStock.subtract(requiredQuantity));
                                ingredientRepository.save(ingredient);
                            } else {
                                throw new RuntimeException("Nguyên liệu " + ingredient.getIngredientName() + " không đủ tồn kho");
                            }
                        }
                    }
                }
            }
        }
    }
}