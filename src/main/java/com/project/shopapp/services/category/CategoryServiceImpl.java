package com.project.shopapp.services.category;

import com.project.shopapp.dtos.CategoryDTO;
import com.project.shopapp.models.Category;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface CategoryServiceImpl {
    Category create(CategoryDTO category);

    Category getCategoryById(Long id);

    List<Category> getAllCategories();

    Category update(Long categoryId, CategoryDTO category);

    void deleteCategory(Long id);
}
