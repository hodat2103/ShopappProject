package com.project.shopapp.controllers;

import com.project.shopapp.dtos.CategoryDTO;
import com.project.shopapp.models.Category;
import com.project.shopapp.responses.category.CategoryMessageResponse;
import com.project.shopapp.services.category.CategoryServiceImpl;
import com.project.shopapp.components.LocalizationUtils;
import com.project.shopapp.utils.MessageKeys;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryServiceImpl categoryService;
    private final LocalizationUtils localizationUtils;
    @PostMapping("")//http://localhost:8080/api/v1/categories
    public ResponseEntity<CategoryMessageResponse> create(
            @Valid @RequestBody CategoryDTO catetoryDTO,
            BindingResult result){

            if(result.hasErrors()){
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError:: getDefaultMessage)
                        .toList();
                return ResponseEntity.badRequest().body(CategoryMessageResponse.builder()
                                .message(localizationUtils.getLocalizationMessage(MessageKeys.CREATE_CATEGORY_FAILED,errorMessages))
                        .build());
            }
            categoryService.create(catetoryDTO);
            return ResponseEntity.ok(CategoryMessageResponse.builder()
                            .message(localizationUtils.getLocalizationMessage(MessageKeys.CREATE_CATEGORY_SUCCESSFULLY))
                    .build());


    }

    @GetMapping("")//http://localhost:8080/api/v1/categories?page=1&limit=10
    public ResponseEntity<?> getAllCategory(
            @RequestParam("page") int page,
            @RequestParam("limit") int limit

    ){
            List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }
    @GetMapping("/{id}")//http://localhost:8080/api/v1/categories?id=?
    public ResponseEntity<?> getCategoryById(
            @PathVariable Long id

    ){
        Category categories = categoryService.getCategoryById(id);
        return ResponseEntity.ok(categories);
    }

    @PutMapping ("/{id}")//http://localhost:8080/api/v1/categories
    public ResponseEntity<CategoryMessageResponse> update(@PathVariable Long id,
                                                          @RequestBody  CategoryDTO categoryDTO
    ){
        categoryService.update(id,categoryDTO);
        return ResponseEntity.ok(CategoryMessageResponse.builder()
                .message(localizationUtils.getLocalizationMessage(MessageKeys.UPDATE_CATEGORY_SUCCESSFULLY))
                .build());
    }
    @DeleteMapping("/{id}")//http://localhost:8080/api/v1/categories
    public ResponseEntity<CategoryMessageResponse> delete(@PathVariable Long id){
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(CategoryMessageResponse.builder()
                .message(localizationUtils.getLocalizationMessage(MessageKeys.DELETE_CATEGORY_SUCCESSFULLY))
                .build());
    }
}
