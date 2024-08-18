package com.project.shopapp.controllers;

import com.project.shopapp.models.Category;
import com.project.shopapp.models.Order;
import com.project.shopapp.models.Product;
import com.project.shopapp.models.User;
import com.project.shopapp.services.category.CategoryService;
import com.project.shopapp.services.excel.ExcelService;
import com.project.shopapp.services.order.OrderService;
import com.project.shopapp.services.product.ProductService;
import com.project.shopapp.services.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.util.List;

@RestController
@RequestMapping("${api.prefix}/excel")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ExcelExportController {

    private final UserService userService;
    private final CategoryService categoryService;
    private final ProductService productService;
    private final OrderService orderService;
    private final ExcelService excelService;

    @GetMapping("/export/{data_name}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public void exportExcel(@Valid @PathVariable("data_name") String dataName, HttpServletResponse response) throws Exception {

        if(dataName.equals("users")){
            List<User> users = userService.getAll();
            excelService.exportToExcel(users, "user_list", response);
        } else if(dataName.equals("categories")){
            List<Category> categories = categoryService.getAllCategories();
            excelService.exportToExcel(categories, "category_list", response);
        } else if(dataName.equals("products")){
            List<Product> products = productService.findAll();
            excelService.exportToExcel(products, "product_list", response);
        } else if(dataName.equals("orders")){
            List<Order> orders = orderService.findAll();
            excelService.exportToExcel(orders, "order_list", response);
        }
    }
}
