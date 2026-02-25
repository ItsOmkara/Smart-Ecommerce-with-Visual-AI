package com.visualai.backend.service;

import com.visualai.backend.dto.ProductDTO;
import com.visualai.backend.entity.Product;
import com.visualai.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<ProductDTO> getProductById(Long id) {
        return productRepository.findById(id).map(this::toDTO);
    }

    public List<ProductDTO> getProductsByCategory(String category) {
        return productRepository.findByCategory(category).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> searchProducts(String query) {
        return productRepository.searchByNameOrDescription(query).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getRelatedProducts(Long productId, String category, int limit) {
        return productRepository.findByCategoryAndIdNot(category, productId).stream()
                .limit(limit)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private ProductDTO toDTO(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .originalPrice(product.getOriginalPrice())
                .image(product.getImage())
                .images(product.getImages())
                .category(product.getCategory())
                .rating(product.getRating())
                .reviews(product.getReviews())
                .badge(product.getBadge())
                .colors(product.getColors())
                .sizes(product.getSizes())
                .inStock(product.getInStock())
                .build();
    }
}
