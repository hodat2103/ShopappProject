package com.project.shopapp.services.coupon;

public interface CouponServiceImpl {
    double calculateCouponValue(String couponCode, double totalAmount);

}
