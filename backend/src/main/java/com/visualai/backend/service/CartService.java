package com.visualai.backend.service;

import com.visualai.backend.dto.CartItemDTO;
import com.visualai.backend.dto.CartItemRequest;
import com.visualai.backend.entity.CartItem;
import com.visualai.backend.entity.Product;
import com.visualai.backend.entity.User;
import com.visualai.backend.repository.CartRepository;
import com.visualai.backend.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public List<CartItemDTO> getCartItems(User user) {
        return cartRepository.findByUser(user).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public CartItemDTO addToCart(User user, CartItemRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if item already in cart
        CartItem cartItem = cartRepository.findByUserAndProductId(user, request.getProductId())
                .orElse(null);

        if (cartItem != null) {
            // Update quantity
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
            if (request.getSelectedColor() != null)
                cartItem.setSelectedColor(request.getSelectedColor());
            if (request.getSelectedSize() != null)
                cartItem.setSelectedSize(request.getSelectedSize());
        } else {
            // Create new cart item
            cartItem = CartItem.builder()
                    .user(user)
                    .product(product)
                    .quantity(request.getQuantity())
                    .selectedColor(request.getSelectedColor())
                    .selectedSize(request.getSelectedSize())
                    .build();
        }

        cartRepository.save(cartItem);
        return toDTO(cartItem);
    }

    @Transactional
    public CartItemDTO updateQuantity(User user, Long productId, int quantity) {
        CartItem cartItem = cartRepository.findByUserAndProductId(user, productId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (quantity <= 0) {
            cartRepository.delete(cartItem);
            return null;
        }

        cartItem.setQuantity(quantity);
        cartRepository.save(cartItem);
        return toDTO(cartItem);
    }

    @Transactional
    public void removeFromCart(User user, Long productId) {
        cartRepository.deleteByUserAndProductId(user, productId);
    }

    @Transactional
    public void clearCart(User user) {
        cartRepository.deleteByUser(user);
    }

    private CartItemDTO toDTO(CartItem item) {
        Product p = item.getProduct();
        return CartItemDTO.builder()
                .id(item.getId())
                .productId(p.getId())
                .productName(p.getName())
                .productImage(p.getImage())
                .category(p.getCategory())
                .price(p.getPrice())
                .originalPrice(p.getOriginalPrice())
                .quantity(item.getQuantity())
                .selectedColor(item.getSelectedColor())
                .selectedSize(item.getSelectedSize())
                .inStock(p.getInStock())
                .build();
    }
}
