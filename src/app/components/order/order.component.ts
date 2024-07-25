import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product';
import { environment } from '../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderDTO } from '../../dtos/order.dto';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  orderForm: FormGroup;
  cartItems: { product: Product, quantity: number }[] = [];
  couponCode: string = '';
  totalAmount: number = 0;
  orderId: number = 0;
  orderData: OrderDTO = {
    user_id: 12,
    fullname: '',
    email: '',
    phone_number: '',
    address: '',
    note: '',
    status: '',
    total_money: 0,
    payment_method: 'cod',
    shipping_method: 'express',
    coupon_code: '',
    cart_items: []
  };

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private cartService: CartService,
    private tokenService: TokenService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.orderForm = this.fb.group({
      fullname: ['ho ba test', Validators.required],
      email: ['hobatest@gmail.com', Validators.email],
      phone_number: ['0334204369', [Validators.required, Validators.minLength(6)]],
      address: ['TK, ha noi', [Validators.required, Validators.minLength(5)]],
      note: ['Khonng'],
      shipping_method: ['express'],
      payment_method: ['cod']
    });
  }

  ngOnInit() {
    debugger
    this.orderData.user_id = this.tokenService.getUserId();

    debugger
    const cart = this.cartService.getCart();
    
    const productIds = Array.from(cart.keys());
    if(productIds.length === 0){
      return;
    }
    this.productService.getProductsByIds(productIds).subscribe({
      next: (products) => {
        this.cartItems = productIds.map((productId) => {
          const product = products.find((p) => p.id === productId);
          if (product) {
            product.thumbnail = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
          }
          return {
            product: product!,
            quantity: cart.get(productId)!
          };
        });
        this.calculateTotal();
        this.orderData.total_money = this.totalAmount;
      },
      error: (error: any) => {
        console.error('Error fetching order confirm: ', error);
      }
    });
  }

  placeOrder() {
    if (this.orderForm.valid) {
      this.orderData = {
        ...this.orderData,
        ...this.orderForm.value
      };

      this.orderData.cart_items = this.cartItems.map(cartItem => ({
        product_id: cartItem.product.id,
        quantity: cartItem.quantity
      }));

      this.orderService.placeOrder(this.orderData).subscribe({
        next: (response) => {
          alert('Đặt hàng thành công');
          this.cartService.clearCart();
          this.router.navigate(['/orders', response.id]); 
        },
        complete: () => {
          debugger
          this.calculateTotal();

        },
        error: (error: any) => {
          alert(`Lỗi khi đặt hàng: ${error}`);
        }
      });
    }
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  applyCoupon(): void {
    // Logic áp dụng coupon
  }

}
