package com.project.shopapp.controllers;

import com.project.shopapp.components.LocalizationUtils;
import com.project.shopapp.dtos.OrderDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.models.Order;
import com.project.shopapp.responses.OrderListResponse;
import com.project.shopapp.responses.OrderResponse;
import com.project.shopapp.responses.ProductListResponse;
import com.project.shopapp.responses.ProductResponse;
import com.project.shopapp.responses.messages.OrderMessageResponse;
import com.project.shopapp.services.impl.OrderServiceImpl;
import com.project.shopapp.utils.MessageKeys;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/orders")
@RequiredArgsConstructor
public class OrderController{
    private final OrderServiceImpl orderService;
    private final LocalizationUtils localizationUtils;
    @PostMapping("")
    public ResponseEntity<?> create(
            @Valid @RequestBody OrderDTO orderDTO,
            BindingResult result) {
        try {
            if(result.hasErrors()){
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError:: getDefaultMessage)
                        .toList();
                return ResponseEntity.badRequest().body(errorMessages);
            }
            Order order = orderService.create(orderDTO);
            return ResponseEntity.ok(order);

        } catch (Exception ex) {

            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
    @GetMapping("/user/{user_id}")
    public ResponseEntity<?> getOrders(@Valid @PathVariable("user_id") Long userId){
        try {
            List<Order> orders = orderService.getAllOrders(userId);
            return ResponseEntity.ok(orders);
        }catch(Exception ex){
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(@Valid @PathVariable("id") Long orderId){
        try {
            Order existsOrder = orderService.getOrderById(orderId);
            OrderResponse orderResponse = OrderResponse.fromOrder(existsOrder);
            return ResponseEntity.ok(orderResponse);
        }catch(Exception ex){
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @Valid @PathVariable Long id,
            @RequestBody OrderDTO orderDTO
    ){
        Order order = null;
        try {
            order = orderService.update(id,orderDTO);
            return ResponseEntity.ok(order);

        } catch (DataNotFoundException e) {
            return  ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<OrderMessageResponse> delete(@Valid @PathVariable Long id){
        //delete soft -> update in the field active = false (See again information )
        orderService.delete(id);
        return ResponseEntity.ok(OrderMessageResponse.builder()
                        .message(localizationUtils.getLocalizationMessage(
                                MessageKeys.DELETE_ORDER_SUCCESSFULLY,id))
                .build());
    }

    @GetMapping("/get-orders-by-keyword")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<OrderListResponse> getOrdersByKeyword(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0",name = "page") int page,
            @RequestParam(defaultValue = "10",name = "limit") int limit){
        PageRequest pageRequest = PageRequest.of(
                page, limit,
//                Sort.by("createdAt").descending());
                Sort.by("id").ascending());

        Page<OrderResponse> orderPage = orderService
                                            .findOrdersByKeyword(keyword,pageRequest)
                                            .map(OrderResponse::fromOrder);
        // get sum number of page
        int totalPages = orderPage.getTotalPages();
        List<OrderResponse> orderResponses = orderPage.getContent();
        return ResponseEntity.ok(OrderListResponse
                .builder()
                .orders(orderResponses)
                .totalPages(totalPages)
                .build());
    }
}
