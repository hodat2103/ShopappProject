package com.project.shopapp.controllers;

import com.project.shopapp.components.LocalizationUtils;
import com.project.shopapp.dtos.OrderDetailDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.models.OrderDetail;
import com.project.shopapp.responses.OrderDetailResponse;
import com.project.shopapp.responses.messages.OrderDetailMessageResponse;
import com.project.shopapp.services.OrderDetailService;
import com.project.shopapp.services.impl.OrderDetailServiceImpl;
import com.project.shopapp.utils.MessageKeys;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/order_details")
@RequiredArgsConstructor
public class OrderDetailController {
    private final OrderDetailServiceImpl orderDetailService;
    private final LocalizationUtils localizationUtils;
    @PostMapping("")
    public ResponseEntity<?> create(
            @Valid @RequestBody OrderDetailDTO orderDetailDTO,
            BindingResult result) {
        try {
            OrderDetail newOrderDetail = orderDetailService.create(orderDetailDTO);
            return ResponseEntity.ok(OrderDetailResponse.fromOrderDetail(newOrderDetail));

        } catch (Exception ex) {

            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
    @GetMapping("/{id}")
    private ResponseEntity<?> getOrderDetail(@Valid @PathVariable("id") Long id){
        try {
            OrderDetail orderDetail = orderDetailService.getOrderDetail(id);
            return ResponseEntity.ok(OrderDetailResponse.fromOrderDetail(orderDetail));

        } catch (DataNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/order/{orderId}")
    private ResponseEntity<?> getOrderDetails(@Valid @PathVariable("orderId") Long orderId){
        List<OrderDetail> orderDetails = orderDetailService.findByOrderId(orderId);
        List<OrderDetailResponse> orderDetailResponses = orderDetails
                .stream()
                .map(orderDetail -> OrderDetailResponse.fromOrderDetail(orderDetail))
                .toList();
        return ResponseEntity.ok(orderDetailResponses);
    }
    @PutMapping("{id}")
    public ResponseEntity<?> update(
            @Valid @PathVariable("id") Long id,
            @RequestBody OrderDetailDTO orderDetailData){
        try {
            OrderDetail orderDetail = orderDetailService.update(id, orderDetailData);
            return ResponseEntity.ok(orderDetail);

        } catch (DataNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<OrderDetailMessageResponse> delete (@Valid @PathVariable("id") Long id){
        orderDetailService.delete(id);
        return ResponseEntity.ok().body(OrderDetailMessageResponse.builder()
                .message(localizationUtils.getLocalizationMessage(
                        MessageKeys.DELETE_ORDER_DETAIL_SUCCESSFULLY,id))
                .build());
    }
}
