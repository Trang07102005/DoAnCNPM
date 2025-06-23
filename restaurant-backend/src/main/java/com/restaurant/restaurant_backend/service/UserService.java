package com.restaurant.restaurant_backend.service;

import com.restaurant.restaurant_backend.model.Users;
import com.restaurant.restaurant_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // Lấy tất cả Users
    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }

    // Lấy User theo ID
    public Optional<Users> getUserById(Integer id) {
        return userRepository.findById(id);
    }

    // Thêm mới User
    public Users createUser(Users user) {
        // Validate
        if (userRepository.existsById(user.getUserId() != null ? user.getUserId() : -1)) {
            throw new UnsupportedOperationException("User ID đã tồn tại!");
        }
        // Nếu cần: kiểm tra username/email trùng
        List<Users> allUsers = userRepository.findAll();
        for (Users u : allUsers) {
            if (u.getUsername().equalsIgnoreCase(user.getUsername())) {
                throw new UnsupportedOperationException("Username đã tồn tại!");
            }
            if (u.getEmail().equalsIgnoreCase(user.getEmail())) {
                throw new UnsupportedOperationException("Email đã tồn tại!");
            }
        }

        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    // Cập nhật User
    public Users updateUser(Integer id, Users updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setUsername(updatedUser.getUsername());
            user.setPassword(updatedUser.getPassword());
            user.setEmail(updatedUser.getEmail());
            user.setRole(updatedUser.getRole());
            user.setUpdatedAt(LocalDateTime.now());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy User!"));
    }

    // Xoá User
    public void deleteUser(Integer id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy User!");
        }
        userRepository.deleteById(id);
    }
}
