package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.model.Users;
import com.restaurant.restaurant_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173") // Cho phép frontend truy cập
@PreAuthorize("hasRole('ADMIN')") // Chặn toàn bộ controller nếu không phải admin
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        String newRole = body.get("role");

        List<String> validRoles = List.of("Admin", "Customer", "Staff", "Manager", "Cashier", "Chef");
        if (!validRoles.contains(newRole)) {
            return ResponseEntity.badRequest().body("Vai trò không hợp lệ");
        }

        Users user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        user.setRole(newRole);
        userRepository.save(user);

        return ResponseEntity.ok("Cập nhật vai trò thành công");
    }
}
