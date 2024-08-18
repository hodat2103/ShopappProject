package com.project.shopapp.services.order;

import com.project.shopapp.dtos.CartItemDTO;
import com.project.shopapp.dtos.OrderDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.models.*;
import com.project.shopapp.repositories.*;
import com.project.shopapp.responses.order.OrderResponse;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService implements OrderServiceImpl {
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;
    private final ModelMapper modelMapper;
    @Override
    public Order create(OrderDTO orderDTO) throws DataNotFoundException {
        //check user exists
        User user = userRepository
                .findById(orderDTO.getUserId())
                .orElseThrow(() -> new DataNotFoundException("Cannot find user with id = " + orderDTO.getUserId()));
        //convert orderDTO -> order (using model mapping)
        // how to create a thread ->  by mapper to control map
        modelMapper.typeMap(OrderDTO.class, Order.class)
                .addMappings(mapper -> mapper.skip(Order::setId));
        // update the field from table order
        Order order = new Order();
        modelMapper.map(orderDTO,order);
        order.setUser(user);
        order.setOrderDate(new Date());
        order.setStatus(OrderStatus.PENDING);
        LocalDate shippingDate = orderDTO.getShippingDate() == null ? LocalDate.now(): orderDTO.getShippingDate();
        if(shippingDate.isBefore(LocalDate.now())){
            throw  new DataNotFoundException("Date must be at least today");
        }
        order.setShippingDate(shippingDate);
        String paymentMethod = orderDTO.getPaymentMethod();
        if( paymentMethod == "cod"){
            order.setActive(false);
        } else if (paymentMethod == "vnpay") {
            order.setActive(true);
        }
        order.setTotalMoney(orderDTO.getTotalMoney());

        orderRepository.save(order);

        List<OrderDetail> orderDetails = new ArrayList<>();
        for(CartItemDTO cartItemDTO : orderDTO.getCartItems()){
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(order);

            Long productId = cartItemDTO.getProductId();
            int quantity = cartItemDTO.getQuantity();

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new DataNotFoundException("Product not found with id: " + productId));

            orderDetail.setProduct(product);
            orderDetail.setNumberOfProduct(quantity);

            orderDetail.setPrice(product.getPrice());

            orderDetails.add(orderDetail);

        }
        String couponCode = orderDTO.getCouponCode();
        if (!couponCode.isEmpty()) {
            Coupon coupon = couponRepository.findByCode(couponCode)
                    .orElseThrow(() -> new IllegalArgumentException("Coupon not found"));

            if (!coupon.isActive()) {
                throw new IllegalArgumentException("Coupon is not active");
            }

            order.setCoupon(coupon);
        } else {
            order.setCoupon(null);
        }
        orderDetailRepository.saveAll(orderDetails);
        return order;
    }

    @Override
    public Order getOrderById(Long id) {
         Order selectedOrder =  orderRepository.findById(id).orElse(null);
         return selectedOrder;
    }

//    @Override
//    public List<Order> getAllOrders(Long userId) {
//        return orderRepository.findByUserId(userId);
//    }

    @Override
    @Transactional
    public Order update(Long orderId, OrderDTO orderDTO) throws DataNotFoundException {

        Order order = orderRepository.findById(orderId).orElseThrow(() ->
                new DataNotFoundException("Cannot find order with id = " + orderId));
        User existsUser = userRepository.findById(orderDTO.getUserId()).orElseThrow(() ->
                new DataNotFoundException("Cannot find user with id = " + orderDTO.getUserId()));
        //create thread mapping to control
        modelMapper.typeMap(OrderDTO.class, Order.class)
                .addMappings(mapper -> mapper.skip(Order::setId));
        //update fields the order from orderDTO
        modelMapper.map(orderDTO,order);

        order.setUser(existsUser);
        if(orderDTO.getStatus().equals("cancelled")){
            order.setActive(false);
        }
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Order order = orderRepository.findById(id).orElse(null);
        //no hard delete => soft delete
        if(order != null){
            order.setActive(false);
            orderRepository.save(order);
        }
    }

    @Override
    public List<OrderResponse> findByUserId(Long userId){
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream().map(order -> OrderResponse.fromOrder(order)).toList();
    }

    @Override
    public Page<Order> findOrdersByKeyword(String keyword, Pageable pageable) {
        return orderRepository.findByKeyword(keyword,pageable);

    }

    @Override
    public List<Order> findAll() {
        return orderRepository.findAll();
    }

}
