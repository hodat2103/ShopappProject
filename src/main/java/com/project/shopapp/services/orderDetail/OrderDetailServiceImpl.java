package com.project.shopapp.services.orderDetail;

import com.project.shopapp.dtos.OrderDetailDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.models.OrderDetail;

import java.util.List;

public interface OrderDetailServiceImpl {
    OrderDetail create(OrderDetailDTO orderDetailDTO) throws DataNotFoundException;

    OrderDetail getOrderDetail(Long id) throws DataNotFoundException;

    List<OrderDetail> findByOrderId(Long orderId);

    OrderDetail update(Long orderId, OrderDetailDTO orderDetailDTO) throws DataNotFoundException;

    void delete(Long id);

}
