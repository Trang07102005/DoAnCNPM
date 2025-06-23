package com.restaurant.restaurant_backend.service;

import com.restaurant.restaurant_backend.model.Users;
import com.restaurant.restaurant_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }

    public Users getUserById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + id));
    }

    public Users createUser(Users user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại!");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email đã tồn tại!");
        }

        user.setUserId(null);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    public Users updateUser(Integer id, Users updated) {
        Users existing = getUserById(id);

        //  Cố định username, email, password
        // Chỉ cho đổi role và updatedAt
        existing.setRole(updated.getRole());
        existing.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(existing);
    }

    public void deleteUser(Integer id) {
        Users user = getUserById(id);

        if ("Admin".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Không được phép xóa người dùng có vai trò Admin!");
        }

        userRepository.deleteById(id);
    }
}
