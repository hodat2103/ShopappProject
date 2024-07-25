package com.project.shopapp.services.impl;

import com.project.shopapp.dtos.CategoryDTO;
import com.project.shopapp.dtos.OrderDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.models.Category;
import com.project.shopapp.models.Order;
import com.project.shopapp.responses.OrderResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrderServiceImpl {
    Order create(OrderDTO orderDTO) throws DataNotFoundException;

    Order getOrderById(Long id);

    List<Order> getAllOrders(Long userId);

    Order update(Long orderId, OrderDTO orderDTO) throws DataNotFoundException;

    void delete(Long id);
    List<Order> findByUserId(Long userId);

    Page<Order> findOrdersByKeyword(String keyword, Pageable pageable);
}
