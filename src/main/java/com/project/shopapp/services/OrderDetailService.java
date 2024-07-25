package com.project.shopapp.services;

import com.project.shopapp.dtos.OrderDetailDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.models.Order;
import com.project.shopapp.models.OrderDetail;
import com.project.shopapp.models.Product;
import com.project.shopapp.repositories.OrderDetailRepository;
import com.project.shopapp.repositories.OrderRepository;
import com.project.shopapp.repositories.ProductRepository;
import com.project.shopapp.services.impl.OrderDetailServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@RequiredArgsConstructor
@Service
public class OrderDetailService implements OrderDetailServiceImpl {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final OrderDetailRepository orderDetailRepository;

    @Override
    public OrderDetail create(OrderDetailDTO orderDetailDTO) throws DataNotFoundException {
        Order exsistOrder = orderRepository.findById(orderDetailDTO.getOrderId()).orElseThrow(() ->
                new DataNotFoundException("Cannot find order with id  = "+ orderDetailDTO.getOrderId()));
        Product exsistProduct = productRepository.findById(orderDetailDTO.getProductId()).orElseThrow(() ->
                new DataNotFoundException("Cannot find product with id  = "+ orderDetailDTO.getOrderId()));
        OrderDetail newOrderDetail = OrderDetail.builder()
                .order(exsistOrder)
                .product(exsistProduct)
                .price(orderDetailDTO.getPrice())
                .numberOfProduct(orderDetailDTO.getNumberOfProduct())
                .totalMoney(orderDetailDTO.getTotalMoney())
                .color(orderDetailDTO.getColor())
                .build();
        return orderDetailRepository.save(newOrderDetail);
    }

    @Override
    public OrderDetail getOrderDetail(Long id) throws DataNotFoundException {
        return orderDetailRepository.findById(id).orElseThrow(() ->
                new DataNotFoundException("Cannot order detail with id = "+ id) );
    }

    @Override
    public List<OrderDetail> findByOrderId(Long orderId) {
        return orderDetailRepository.findByOrderId(orderId);
    }

    @Override
    public OrderDetail update(Long orderDetailId, OrderDetailDTO orderDetailDTO) throws DataNotFoundException {
        OrderDetail existsOrderDetail = orderDetailRepository.findById(orderDetailId).orElseThrow(() ->
                new DataNotFoundException("Cannot find order detail with id = " + orderDetailId));
        Order existsOrder = orderRepository.findById(orderDetailDTO.getOrderId()).orElseThrow(() ->
                new DataNotFoundException("Cannot find order with id = " + orderDetailDTO.getOrderId()));
        Product existsProduct = productRepository.findById(orderDetailDTO.getProductId()).orElseThrow(() ->
                new DataNotFoundException("Cannot find product with id = "+ orderDetailDTO.getProductId()));
        existsOrderDetail.setOrder(existsOrder);
        existsOrderDetail.setProduct(existsProduct);
        existsOrderDetail.setPrice(orderDetailDTO.getPrice());
        existsOrderDetail.setNumberOfProduct(orderDetailDTO.getNumberOfProduct());
        existsOrderDetail.setTotalMoney(orderDetailDTO.getTotalMoney());
        existsOrderDetail.setColor(orderDetailDTO.getColor());
        return orderDetailRepository.save(existsOrderDetail);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        orderDetailRepository.deleteById(id);
    }
}
