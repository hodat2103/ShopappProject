import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product';
import { environment } from '../../environments/environment';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { OrderDTO } from '../../dtos/order.dto';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../responses/users/user.detail.response';
import { ApiResponse } from '../../responses/api.response';
import { CommonModule } from '@angular/common';
import { CouponService } from '../../services/coupon.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  // standalone: true,
  // imports: [   
  //       CommonModule,
  //       FormsModule,
  //     ]
})
export class OrderComponent implements OnInit {
  orderForm: FormGroup;
  cartItems: { product: Product, quantity: number }[] = [];
  cart: Map<number, number> = new Map();
  couponDiscount: number = 0;   
  couponApplied: boolean = false;
  totalAmount: number = 0;
  parseData: number = 0;
  orderId: number = 0;
  userResponse?: UserResponse;
  orderData: OrderDTO = {
    user_id: 0,
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
    private userService: UserService,
    private couponService: CouponService,
    private paymentService: PaymentService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.getUserDetail();
    this.orderForm = this.fb.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      note: ['No'],
      couponCode: [''],
      shipping_method: ['express'],
      payment_method: ['cod']
    });
  }

  ngOnInit() {
    // this.cartService.clearCart();
    debugger
    this.orderData.user_id = this.tokenService.getUserId();

    debugger
    this.getProductsFromCart();
  }
  getProductsFromCart(){
    const cart = this.cartService.getCart();

    const productIds = Array.from(cart.keys());
    if (productIds.length === 0) {
      return;
    }
    this.productService.getProductsByIds(productIds).subscribe({
      next: (products) => {
        this.cartItems = productIds.map((productId) => {
          const product = products.find((p) => p.id === productId);
          if (product) {
            product.thumbnail = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
            console.log('thhumbnail: ',product.thumbnail)
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
  getUserDetail() {
    const token = this.tokenService.getToken();
    debugger
    if(token){
      this.userService.getUserDetail(token).subscribe({
        next: (apiResponse: any) => {
          debugger
          this.userResponse = apiResponse;
          this.orderForm.patchValue({
            fullname: this.userResponse?.fullname,
            email: this.userResponse?.email,
            phone_number: this.userResponse?.phone_number,
            address: this.userResponse?.address,
          });
        },
        complete:() => {
          debugger
          // console.log('Request completed');

        }, 
        error: (error: any) => {
          console.error('Error fetching order confirm: ', error);
        }
      })
    }else{
      console.log('Token: null');
    }

   
  }
  placeOrder() {
    debugger
    if (this.orderForm.errors == null) {
      // attachment value from form to  orderData object
      /*
      this.orderData.fullname = this.orderForm.get('fullname')!.value;
      this.orderData.email = this.orderForm.get('email')!.value;
      this.orderData.phone_number = this.orderForm.get('phone_number')!.value;
      this.orderData.address = this.orderForm.get('address')!.value;
      this.orderData.note = this.orderForm.get('note')!.value;
      this.orderData.shipping_method = this.orderForm.get('shipping_method')!.value;
      this.orderData.payment_method = this.orderForm.get('payment_method')!.value;
      */
      // Use operator spread (...) => copy value from form to orderDate
      this.orderData = {
        ...this.orderData,
        ...this.orderForm.value
      };

      this.orderData.cart_items = this.cartItems.map(cartItem => ({
        product_id: cartItem.product.id,
        quantity: cartItem.quantity
      }));
      debugger
      
        this.orderService.placeOrder(this.orderData).subscribe({
          next: (response: ApiResponse) => {
            debugger;       
            console.log('response: ', response.data)
            response.data.total_money =  this.totalAmount;
            this.orderId = response.data.id;

            if(response.data.paymentMethod === 'cod')
            {
              alert('Đặt hàng thành công. Hãy thanh toán khi nhận hàng!');
            } 

            if(response.data.paymentMethod === 'vnpay')
            {
              debugger
              this.paymentService.createPayment(Math.floor(this.totalAmount), this.orderId).subscribe({
                next: (response) => {
                  console.log('Payment created successfully', response);
                  window.location.href = response.url;
                },
                complete: () => {
                  debugger
                },
                error: (error) => {
                  console.error('Error creating payment', error);
                }
              });  
              
            }

            this.cartService.clearCart();
          },
          complete: () => {
            debugger;
            this.calculateTotal();
          },
          error: (error: HttpErrorResponse) => {
            debugger;
            alert(`Lỗi khi đặt hàng: ${error?.error?.message ?? ''}`);
          },
        });
      
       
      
    } else {
      console.error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
    }        
  }
  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
      // Cập nhật lại this.cart từ this.cartItems
      this.updateCartFromCartItems();
      this.calculateTotal();
    }
  }
  
  increaseQuantity(index: number): void {
    this.cartItems[index].quantity++;   
    this.updateCartFromCartItems();
    this.calculateTotal();
  }

  confirmDelete(index: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      this.cartItems.splice(index, 1);
      this.updateCartFromCartItems();
      this.calculateTotal();
    }
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  applyCoupon(): void {
    debugger
    const couponCode = this.orderForm.get('couponCode')!.value;
    if (!this.couponApplied && couponCode) {
      this.calculateTotal();
       const totalInitial: number = this.totalAmount;
      debugger
      this.couponService.calculateCouponValue(couponCode, this.totalAmount)
        .subscribe({
          next: (apiResponse: any) => {
            console.log('api: ', apiResponse)
            debugger
              this.totalAmount = apiResponse.data.result;
            console.log('total: ', this.totalAmount)
              
              this.couponDiscount = totalInitial - this.totalAmount;
              this.couponApplied = true;
          
           
          },
          complete: () => {
            debugger
            console.log('apply OK')
          },
          error: (error: any) => {
            console.error('Error fetching order confirm: ', error);
          }
        });
    }
  }
  private updateCartFromCartItems(): void {
    this.cart.clear();
    this.cartItems.forEach((item) => {
      this.cart.set(item.product.id, item.quantity);
    });
    this.cartService.setCart(this.cart);
  }

}
