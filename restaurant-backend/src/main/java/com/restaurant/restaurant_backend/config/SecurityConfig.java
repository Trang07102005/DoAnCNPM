package com.restaurant.restaurant_backend.config;

import com.restaurant.restaurant_backend.security.CustomUserDetailsService;
import com.restaurant.restaurant_backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.*;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.*;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;
import org.springframework.web.cors.*;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService userDetailsService;

    @Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .cors(Customizer.withDefaults())
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            // ✅ Public APIs (Không cần token)
            .requestMatchers(
                "/api/auth/**",
                "/api/food/**",
                "/api/chef",
                "/api/food-categories/**",
                "/api/pending",
                "/api/tables",
                "/api/tables/**",
                "/api/with-status",
                "/api/order-status/**",
                "/api/reservations",
                "/api/reservations/**",
                "/error"
            ).permitAll()

            // ✅ ADMIN-only APIs
            .requestMatchers(
                "/api/users/**",
                "/api/admin/**"
            ).hasRole("ADMIN")  // 👈 Dùng hasRole, Spring tự thêm "ROLE_"

            // ✅ STAFF hoặc ADMIN
            .requestMatchers(
                "/api/orders/by-table/**",
                "/api/orders/by-user/**"
            ).hasAnyRole("STAFF", "ADMIN") // 👈 Đổi thành hasAnyRole

            // ✅ STAFF only
            .requestMatchers(
                "/api/orders",
                "/api/tables/serving"
            ).hasRole("STAFF")
            .requestMatchers(
                "/api/order-details/by-order/**",
                "/api/order-status/by-order/**",
                "/api/order-details/**",
                "/api/order-details/{orderDetailId}/quantity/**",
                "/api/order-details/delete/**",
                "/api/orders/**"
            ).hasAnyRole("STAFF", "CASHIER", "MANAGER")
            .requestMatchers("/api/cashier/**").hasRole("CASHIER") // 👈 Dùng hasRole, Spring tự thêm "ROLE_"

            .requestMatchers(
                "/api/manager/**",
                "/api/orders/filter"
                ).hasRole("MANAGER") // 👈 THÊM DÒNG NÀY
            // ✅ Các API khác yêu cầu đăng nhập
            .anyRequest().authenticated()
            
        )
        .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authenticationProvider(authenticationProvider())
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}




    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http)
        throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder())
                .and()
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    // ✅ Thêm bean cấu hình CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173")); // đổi đúng origin frontend
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
public HttpFirewall strictHttpFirewall() {
    StrictHttpFirewall firewall = new StrictHttpFirewall();
    
    // ⚠️ Cho phép một số ký tự đặc biệt nếu cần
    firewall.setUnsafeAllowAnyHttpMethod(true); // Tuỳ chọn nếu bạn có PUT/DELETE

    // Tuỳ chọn nếu bạn cần cho phép các ký tự cụ thể như %, \n, v.v.
    firewall.setAllowedHttpMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    
    // ⚠️ KHÔNG có cách cho phép trực tiếp %0A trong Spring Security 6 — bạn phải tránh gửi từ frontend

    return firewall;
}

@Bean
public HttpFirewall customHttpFirewall() {
    StrictHttpFirewall firewall = new StrictHttpFirewall();
    
    // ⚠️ Cho phép các ký tự mã hóa mà mặc định bị chặn
    firewall.setAllowUrlEncodedPercent(true);
    firewall.setAllowUrlEncodedSlash(true);
    firewall.setAllowSemicolon(true);
    firewall.setAllowBackSlash(true);

    return firewall;
}

@Bean
public WebSecurityCustomizer webSecurityCustomizer(@Qualifier("customHttpFirewall") HttpFirewall firewall) {
    return (web) -> web.httpFirewall(firewall);
}

}
