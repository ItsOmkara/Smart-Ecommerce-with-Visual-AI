package com.visualai.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @Column(nullable = false)
    private double subtotal;

    @Builder.Default
    private double shipping = 0;

    @Builder.Default
    private double discount = 0;

    @Column(nullable = false)
    private double total;

    @Column(nullable = false)
    @Builder.Default
    private String status = "PLACED";

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    // Shipping address
    private String shippingName;
    private String shippingPhone;
    private String shippingStreet;
    private String shippingCity;
    private String shippingState;
    private String shippingZip;
}
