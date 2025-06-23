package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.model.Users;
import com.restaurant.restaurant_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // ✅ Lấy danh sách toàn bộ user
    @GetMapping
    public ResponseEntity<List<Users>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // ✅ Lấy 1 user theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(userService.getUserById(id));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(404).body("Lỗi: " + ex.getMessage());
        }
    }

    // ✅ Tạo user mới
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody Users user) {
        try {
            Users created = userService.createUser(user);
            return ResponseEntity.status(201).body(created);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body("Lỗi: " + ex.getMessage());
        }
    }

    // ✅ Cập nhật user: chỉ cho đổi role
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Integer id, @RequestBody Users user) {
        try {
            Users updated = userService.updateUser(id, user);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(404).body("Lỗi: " + ex.getMessage());
        }
    }

    // ✅ Xoá user: KHÔNG cho xoá user có role Admin
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.status(400).body("Lỗi: " + ex.getMessage());
        }
    }
}
