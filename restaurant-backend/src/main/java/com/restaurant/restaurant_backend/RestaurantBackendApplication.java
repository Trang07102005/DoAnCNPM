package com.restaurant.restaurant_backend;

import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.restaurant.restaurant_backend.model.Role;
import com.restaurant.restaurant_backend.model.Users;
import com.restaurant.restaurant_backend.repository.RoleRepository;
import com.restaurant.restaurant_backend.repository.UserRepository;

@SpringBootApplication
@EnableScheduling
public class RestaurantBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(RestaurantBackendApplication.class, args);
	}

	@Bean
	CommandLineRunner initAdmin(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			String adminEmail = "admin1@gmail.com";
			if (!userRepository.existsByEmail(adminEmail)) {
				Role adminRole = roleRepository.findByName("Admin")
						.orElseThrow(() -> new RuntimeException("Không tìm thấy role 'Admin'"));

				Users admin = new Users(
						"admin",
						passwordEncoder.encode("admin123"),
						adminEmail,
						adminRole
				);
				admin.setCreatedAt(LocalDateTime.now());
				admin.setUpdatedAt(LocalDateTime.now());

				userRepository.save(admin);
				System.out.println("✅ Admin user created!");
			} else {
				System.out.println("⚠️ Admin user already exists.");
			}
		};
	}
	
}
