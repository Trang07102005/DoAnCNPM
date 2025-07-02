package com.restaurant.restaurant_backend.repository;

import com.restaurant.restaurant_backend.model.Users; // Import Entity Users

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // Đánh dấu đây là một Spring Repository
public interface UserRepository extends JpaRepository<Users, Integer> {
    // Kế thừa JpaRepository sẽ cung cấp sẵn các phương thức:
    // save(Users entity): Lưu một đối tượng Users vào DB
    // findById(Integer id): Tìm Users theo ID
    // findAll(): Lấy tất cả Users
    // deleteById(Integer id): Xóa Users theo ID
    // ... và nhiều phương thức khác

    // Bạn cũng có thể định nghĩa các phương thức tìm kiếm tùy chỉnh ở đây theo quy ước đặt tên của Spring Data JPA
    // Ví dụ:
    // Optional<Users> findByUsername(String username);
    // List<Users> findByRole(String role);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Optional<Users> findByEmail(String email);
    Optional<Users> findByUsername(String username);

}