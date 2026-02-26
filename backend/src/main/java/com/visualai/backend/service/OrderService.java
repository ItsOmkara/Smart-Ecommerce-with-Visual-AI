package com.visualai.backend.service;

import com.visualai.backend.entity.*;
import com.visualai.backend.repository.CartRepository;
import com.visualai.backend.repository.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;

    @Transactional
    public Order placeOrder(User user, Map<String, String> address) {
        List<CartItem> cartItems = cartRepository.findByUser(user);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Calculate totals
        double subtotal = cartItems.stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();
        double shipping = subtotal > 200 ? 0 : 15;
        double total = subtotal + shipping;

        // Create order
        Order order = Order.builder()
                .user(user)
                .subtotal(subtotal)
                .shipping(shipping)
                .total(total)
                .status("PLACED")
                .createdAt(LocalDateTime.now())
                .build();

        // Set shipping address if provided
        if (address != null) {
            order.setShippingName(address.getOrDefault("fullName", ""));
            order.setShippingPhone(address.getOrDefault("phone", ""));
            order.setShippingStreet(address.getOrDefault("street", ""));
            order.setShippingCity(address.getOrDefault("city", ""));
            order.setShippingState(address.getOrDefault("state", ""));
            order.setShippingZip(address.getOrDefault("zip", ""));
        }

        // Convert cart items to order items
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .productId(cartItem.getProduct().getId())
                    .productName(cartItem.getProduct().getName())
                    .productImage(cartItem.getProduct().getImage())
                    .price(cartItem.getProduct().getPrice())
                    .quantity(cartItem.getQuantity())
                    .selectedColor(cartItem.getSelectedColor())
                    .selectedSize(cartItem.getSelectedSize())
                    .build();
            order.getItems().add(orderItem);
        }

        orderRepository.save(order);

        // Clear cart after placing order
        cartRepository.deleteByUser(user);

        return order;
    }

    public List<Order> getOrderHistory(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }
}
