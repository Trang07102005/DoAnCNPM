package com.restaurant.restaurant_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "`restauranttable`")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TableID")
    private Integer tableId;

    @Column(name = "TableName", nullable = false)
    private String tableName;

    @Column(name = "Status")
    private String status;

    @OneToMany(mappedBy = "restaurantTable", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore  // Tránh vòng lặp JSON
    private List<Reservation> reservations;

    @OneToMany(mappedBy = "restaurantTable", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore  // Tránh vòng lặp JSON
    private List<Order> orders;

    // ✅ Viết lại toString() tránh lỗi StackOverflow
    @Override
    public String toString() {
        return "RestaurantTable{" +
                "tableId=" + tableId +
                ", tableName='" + tableName + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}
