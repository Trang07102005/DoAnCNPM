package com.restaurant.restaurant_backend;

import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.restaurant.restaurant_backend.model.Users;
import com.restaurant.restaurant_backend.repository.UserRepository;

@SpringBootApplication
public class RestaurantBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(RestaurantBackendApplication.class, args);
	}

	  // ✅ Tạo user admin tự động nếu chưa có
	  @Bean
	  CommandLineRunner initAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		  return args -> {
			  String adminEmail = "admin1@gmail.com";
			  if (!userRepository.existsByEmail(adminEmail)) {
				  Users admin = new Users(
						  "admin",
						  passwordEncoder.encode("admin123"),
						  adminEmail,
						  "Admin"
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
