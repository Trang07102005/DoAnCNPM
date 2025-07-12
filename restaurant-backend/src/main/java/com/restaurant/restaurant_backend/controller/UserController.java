package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.model.Role;
import com.restaurant.restaurant_backend.model.Users;
import com.restaurant.restaurant_backend.repository.RoleRepository;
import com.restaurant.restaurant_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173") // frontend React
public class UserController {
    @Autowired
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;
    UserController(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody Users user) {
        if (user.getRole() == null || user.getRole().getName() == null) {
            return ResponseEntity.badRequest().body("Thiếu vai trò người dùng");
        }
    
        // Sau đó trong hàm:
        Role role = roleRepository.findByName(user.getRole().getName()).orElse(null);
        if (role == null) {
            return ResponseEntity.badRequest().body("Vai trò không tồn tại");
        }
    
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(role);
        user.setCreatedAt(java.time.LocalDateTime.now());
        user.setUpdatedAt(java.time.LocalDateTime.now());
    
        Users savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @PutMapping("/{id}")
    public Users updateUser(@PathVariable Integer id, @RequestBody Users userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setUsername(userDetails.getUsername());
            user.setEmail(userDetails.getEmail());
            user.setPassword(passwordEncoder.encode(userDetails.getPassword())); // ✅ mã hóa
            user.setRole(userDetails.getRole());
            user.setUpdatedAt(java.time.LocalDateTime.now());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng ID = " + id));
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Integer id) {
        userRepository.deleteById(id);
    }

    @GetMapping("/chefs")
    public List<Users> getChefs() {
        return userRepository.findByRole_Name("chef");
    }



}
