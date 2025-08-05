package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.model.Gallery;
import com.restaurant.restaurant_backend.model.Role;
import com.restaurant.restaurant_backend.model.Users;
import com.restaurant.restaurant_backend.repository.GalleryRepository;
import com.restaurant.restaurant_backend.repository.RoleRepository;
import com.restaurant.restaurant_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
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

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private GalleryRepository galleryRepository;

    

    // === QUẢN LÝ NGƯỜI DÙNG ===
    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        String newRoleName = body.get("role");

        Role role = roleRepository.findByName(newRoleName).orElse(null);
        if (role == null) {
            return ResponseEntity.badRequest().body("Vai trò không hợp lệ");
        }

        Users user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        user.setRole(role);
        userRepository.save(user);

        return ResponseEntity.ok("Cập nhật vai trò thành công");
    }

    // === QUẢN LÝ ROLE ===

    @GetMapping("/roles")
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @PostMapping("/roles")
    public ResponseEntity<?> createRole(@RequestBody Role role) {
        if (role.getName() == null || role.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Tên vai trò không được để trống");
        }

        if (roleRepository.existsByName(role.getName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Tên vai trò đã tồn tại");
        }

        Role saved = roleRepository.save(role);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/roles/{id}")
    public ResponseEntity<?> deleteRole(@PathVariable Integer id) {
        if (!roleRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        roleRepository.deleteById(id);
        return ResponseEntity.ok("Xoá vai trò thành công");
    }

    // (Tuỳ chọn) Sửa tên vai trò
    @PutMapping("/roles/{id}")
    public ResponseEntity<?> updateRole(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        String newName = body.get("name");

        if (newName == null || newName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Tên không hợp lệ");
        }

        Role role = roleRepository.findById(id).orElse(null);
        if (role == null) {
            return ResponseEntity.notFound().build();
        }

        role.setName(newName.trim());
        roleRepository.save(role);

        return ResponseEntity.ok(role);
    }

    // GET tất cả ảnh
        @GetMapping("/gallery")
        public List<Gallery> getAllImages() {
            return galleryRepository.findAll();
        }
        // POST thêm ảnh mới
@PostMapping("/gallery")
public ResponseEntity<?> addImage(@RequestBody Gallery image) {
    if (image.getImageUrl() == null || image.getImageUrl().trim().isEmpty()) {
        return ResponseEntity.badRequest().body("Link ảnh không được để trống");
    }
    Gallery saved = galleryRepository.save(image);
    return ResponseEntity.status(HttpStatus.CREATED).body(saved);
}

// PUT cập nhật ảnh
@PutMapping("/gallery/{id}")
public ResponseEntity<?> updateImage(@PathVariable Integer id, @RequestBody Gallery image) {
    Gallery existing = galleryRepository.findById(id).orElse(null);
    if (existing == null) {
        return ResponseEntity.notFound().build();
    }

    existing.setImageUrl(image.getImageUrl());
    existing.setCaption(image.getCaption());
    galleryRepository.save(existing);
    return ResponseEntity.ok(existing);
}

// DELETE xoá ảnh
@DeleteMapping("/gallery/{id}")
public ResponseEntity<?> deleteImage(@PathVariable Integer id) {
    if (!galleryRepository.existsById(id)) {
        return ResponseEntity.notFound().build();
    }

    galleryRepository.deleteById(id);
    return ResponseEntity.ok("Xoá ảnh thành công");
}


    
}
