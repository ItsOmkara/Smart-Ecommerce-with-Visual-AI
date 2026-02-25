package com.visualai.backend.controller;

import com.visualai.backend.entity.Order;
import com.visualai.backend.entity.User;
import com.visualai.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<?> placeOrder(@AuthenticationPrincipal User user) {
        try {
            Order order = orderService.placeOrder(user);
            return ResponseEntity.ok(Map.of(
                    "message", "Order placed successfully",
                    "orderId", order.getId(),
                    "total", order.getTotal()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Order>> getOrderHistory(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getOrderHistory(user));
    }
}
