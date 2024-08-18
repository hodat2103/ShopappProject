package com.project.shopapp.services.order;

import com.project.shopapp.dtos.OrderDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.models.Order;
import com.project.shopapp.responses.order.OrderResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrderServiceImpl {
    Order create(OrderDTO orderDTO) throws DataNotFoundException;

    Order getOrderById(Long id);

//    List<OrderResponse> getAllOrders(Long userId);

    Order update(Long orderId, OrderDTO orderDTO) throws DataNotFoundException;

    void delete(Long id);
    List<OrderResponse> findByUserId(Long userId);

    Page<Order> findOrdersByKeyword(String keyword, Pageable pageable);
    List<Order> findAll();
}
