package com.project.shopapp.services.category;

import com.project.shopapp.dtos.CategoryDTO;
import com.project.shopapp.models.Category;
import com.project.shopapp.repositories.CategoryRepository;
import com.project.shopapp.services.category.CategoryServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor //create function constructor
public class CategoryService implements CategoryServiceImpl {
    @Autowired
    private final CategoryRepository categoryRepository;
    @Override
    public Category create(CategoryDTO categoryDTO) {
        Category newCategory = Category
                .builder()
                .name(categoryDTO.getName())
                .build(); // create object empty

//        Category category = new Category();
//        category.setName(categoryDTO.getName());
//        return categoryRepository.save(category);
        return categoryRepository.save(newCategory);
    }

    @Override
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category update(Long categoryId, CategoryDTO categoryDTO) {
        Category existsCategory = getCategoryById(categoryId);
        existsCategory.setName(categoryDTO.getName());
        categoryRepository.save(existsCategory);

        return existsCategory;
    }

    @Override
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
