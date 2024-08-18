package com.project.shopapp.services.product;

import com.project.shopapp.dtos.ProductDTO;
import com.project.shopapp.dtos.ProductImageDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.exceptions.InvalidParamException;
import com.project.shopapp.models.Product;
import com.project.shopapp.models.ProductImage;
import com.project.shopapp.responses.product.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ProductServiceImpl {
    Product create(ProductDTO productDTO) throws Exception;

    Product getProductById(Long id) throws DataNotFoundException;

    Page<ProductResponse> getAllProducts(String keyword, Long categoryId,PageRequest pageRequest) ;

    Product update(Long productId, ProductDTO productDTO) throws DataNotFoundException;

    void delete(Long id);

    boolean existByName(String name);
    ProductImage createProductImage(Long productId, ProductImageDTO productImageDTO) throws DataNotFoundException, InvalidParamException;

    List<Product> findProductsByIds(List<Long> productIds);

    void deleteProductImage(Long productImageId);
    List<Product> findAll();
}
