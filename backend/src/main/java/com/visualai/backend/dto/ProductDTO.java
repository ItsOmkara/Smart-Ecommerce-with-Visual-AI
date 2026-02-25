package com.visualai.backend.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Double originalPrice;
    private String image;
    private List<String> images;
    private String category;
    private Double rating;
    private Integer reviews;
    private String badge;
    private List<String> colors;
    private List<String> sizes;
    private Boolean inStock;
}
