package com.restaurant.restaurant_backend.service;

import com.restaurant.restaurant_backend.model.FoodCategory;
import com.restaurant.restaurant_backend.repository.FoodCategoryRepository;
import com.restaurant.restaurant_backend.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FoodCategoryService {

    @Autowired
    private FoodCategoryRepository foodCategoryRepository;

    @Autowired
    private FoodRepository foodRepository; // ⚡️ Dùng để check ràng buộc

    // ✅ Lấy tất cả danh mục
    public List<FoodCategory> getAllCategories() {
        return foodCategoryRepository.findAll();
    }

    // ✅ Lấy theo ID
    public Optional<FoodCategory> getCategoryById(Integer id) {
        return foodCategoryRepository.findById(id);
    }

    // ✅ Tạo mới
    public FoodCategory createCategory(FoodCategory category) {
        if (category.getCategoryName() == null || category.getCategoryName().trim().isEmpty()) {
            throw new IllegalArgumentException("Tên danh mục không được để trống");
        }
        return foodCategoryRepository.save(category);
    }

    // ✅ Cập nhật
    public FoodCategory updateCategory(Integer id, FoodCategory updatedCategory) {
        updatedCategory.setCategoryId(id);
        return foodCategoryRepository.save(updatedCategory);
    }

    // ✅ Xóa: Có ràng buộc!
    public void deleteCategory(Integer id) {
        long count = foodRepository.countByCategory_CategoryId(id);
        if (count > 0) {
            throw new IllegalStateException("Không thể xóa danh mục vì vẫn còn " + count + " món ăn thuộc danh mục này!");
        }
        foodCategoryRepository.deleteById(id);
    }
}
