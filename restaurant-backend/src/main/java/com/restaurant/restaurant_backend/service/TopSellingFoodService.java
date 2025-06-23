package com.restaurant.restaurant_backend.service;

import com.restaurant.restaurant_backend.model.Food;
import com.restaurant.restaurant_backend.model.TopSellingFood;
import com.restaurant.restaurant_backend.repository.FoodRepository;
import com.restaurant.restaurant_backend.repository.TopSellingFoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TopSellingFoodService {

    private final TopSellingFoodRepository topSellingFoodRepo;
    private final FoodRepository foodRepo;

    // Lấy tất cả Top Selling Food theo ngày
    public List<TopSellingFood> getTopSellingByDate(LocalDate reportDate) {
        return topSellingFoodRepo.findByReportDate(reportDate);
    }

    // Tạo mới hoặc cập nhật Top Selling cho 1 món của ngày đó
    public TopSellingFood generateOrUpdateTopSelling(LocalDate reportDate, Integer foodId, Integer totalSold) {
        if (totalSold < 0) {
            throw new RuntimeException("Số lượng bán không được âm!");
        }

        Food food = foodRepo.findById(foodId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món ăn!"));

        // Tìm xem đã có record cho món này ngày này chưa
        List<TopSellingFood> list = topSellingFoodRepo.findByReportDate(reportDate);
        TopSellingFood existing = list.stream()
                .filter(t -> t.getFood().getFoodId().equals(foodId))
                .findFirst()
                .orElse(null);

        if (existing != null) {
            existing.setTotalSold(totalSold);
            existing.setGeneratedAt(LocalDateTime.now());
            return topSellingFoodRepo.save(existing);
        } else {
            TopSellingFood newTop = new TopSellingFood();
            newTop.setFood(food);
            newTop.setReportDate(reportDate);
            newTop.setTotalSold(totalSold);
            newTop.setGeneratedAt(LocalDateTime.now());
            return topSellingFoodRepo.save(newTop);
        }
    }

    //  Không khuyến khích xoá — nếu thực sự cần thì cho phép
    public void deleteTopSelling(Integer id) {
        if (!topSellingFoodRepo.existsById(id)) {
            throw new RuntimeException("Không tìm thấy record để xoá!");
        }
        topSellingFoodRepo.deleteById(id);
    }
}
