package com.project.shopapp.controllers;

import com.project.shopapp.components.LocalizationUtils;
import com.project.shopapp.dtos.OrderDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.models.Order;
import com.project.shopapp.responses.order.OrderListResponse;
import com.project.shopapp.responses.order.OrderResponse;
import com.project.shopapp.responses.ResponseObject;
import com.project.shopapp.responses.order.OrderMessageResponse;
import com.project.shopapp.services.order.OrderServiceImpl;
import com.project.shopapp.utils.MessageKeys;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
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
            BindingResult result) throws Exception {
        if(result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            return ResponseEntity.badRequest().body(
                    ResponseObject.builder()
                            .message(String.join(";", errorMessages))
                            .status(HttpStatus.BAD_REQUEST)
                            .build());
        }
//        User loginUser = securityUtils.getLoggedInUser();
//        if(orderDTO.getUserId() == null) {
//            orderDTO.setUserId(loginUser.getId());
//        }


        Order orderResponse = orderService.create(orderDTO);
        return ResponseEntity.ok(ResponseObject.builder()
                .message("Insert order successfully")
                .data(orderResponse)
                .status(HttpStatus.OK)
                .build());
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<ResponseObject> getOrders(@Valid @PathVariable("userId") Long userId){
        try {
            List<OrderResponse> orders = orderService.findByUserId(userId);
            return ResponseEntity.ok(ResponseObject.builder()
                    .data(orders)
                    .message("")
                    .build());
        }catch(Exception ex){
            return ResponseEntity.badRequest().body(
                    ResponseObject.builder()
                            .message(String.join(";", ex.getMessage()))
                            .status(HttpStatus.BAD_REQUEST)
                            .build());
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getOrder(@Valid @PathVariable("id") Long orderId){
        try {
            Order existsOrder = orderService.getOrderById(orderId);
            OrderResponse orderResponse = OrderResponse.fromOrder(existsOrder);
            return ResponseEntity.ok(ResponseObject.builder()
                    .data(orderResponse)
                    .message("")
                    .build());
        }catch(Exception ex){
            return ResponseEntity.badRequest().body(
                    ResponseObject.builder()
                            .message(String.join(";", ex.getMessage()))
                            .status(HttpStatus.BAD_REQUEST)
                            .build());
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
    public ResponseEntity<ResponseObject> getOrdersByKeyword(
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
        return ResponseEntity.ok(ResponseObject
                .builder()
                .status(HttpStatus.OK)
                .data(OrderListResponse.builder()
                        .orders(orderResponses)
                        .totalPages(totalPages)
                        .build())
                .message("Get order OK")
                .build());
    }
}
