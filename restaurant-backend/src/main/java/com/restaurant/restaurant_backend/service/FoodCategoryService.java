package com.restaurant.restaurant_backend.service;

import com.restaurant.restaurant_backend.model.FoodCategory;
import com.restaurant.restaurant_backend.repository.FoodCategoryRepository;
import com.restaurant.restaurant_backend.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FoodCategoryService {

    private final FoodCategoryRepository foodCategoryRepository;
    private final FoodRepository foodRepository;

    // Lấy tất cả danh mục
    public List<FoodCategory> getAllCategories() {
        return foodCategoryRepository.findAll();
    }

    // Lấy danh mục theo ID
    public FoodCategory getCategoryById(Integer id) {
        return foodCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với ID: " + id));
    }

    // Tạo mới danh mục
    public FoodCategory createCategory(FoodCategory category) {
        category.setCategoryId(null);
        return foodCategoryRepository.save(category);
    }

    // Cập nhật danh mục
    public FoodCategory updateCategory(Integer id, FoodCategory updated) {
        FoodCategory existing = getCategoryById(id);
        existing.setCategoryName(updated.getCategoryName());
        return foodCategoryRepository.save(existing);
    }

    // Xoá danh mục — Chỉ xoá khi không có món ăn thuộc danh mục
    public void deleteCategory(Integer id) {
        long count = foodRepository.countByCategory_CategoryId(id);
        if (count > 0) {
            throw new RuntimeException("Không thể xoá danh mục vì vẫn còn " + count + " món ăn thuộc danh mục này.");
        }
        foodCategoryRepository.deleteById(id);
    }
}
