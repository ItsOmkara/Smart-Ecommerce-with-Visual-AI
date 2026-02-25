package com.visualai.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class CartItemDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String productImage;
    private String category;
    private double price;
    private Double originalPrice;
    private int quantity;
    private String selectedColor;
    private String selectedSize;
    private boolean inStock;
}
