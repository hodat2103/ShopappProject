import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import e, { Router, ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product';
import { environment } from '../../environments/environment';
import { toASCII } from 'punycode';
import { OrderResponse } from '../../responses/orders/order.response';
import { OrderService } from '../../services/order.service';
import { OrderDetailDTO } from '../../dtos/order.detail.dto';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-order-confirm',
  templateUrl: './order.confirm.component.html',
  styleUrl: './order.confirm.component.scss'
})
export class OrderConfirmComponent implements OnInit{
  orderId: number = 0 ;
  orderResponse: OrderResponse = {
    id: 0,
    user_id: 0,
    fullname: '',
    phone_number: '',
    email: '',
    address: '',
    note: '',
    order_date: new Date(),
    status: '',
    total_money: 0,
    shipping_date: new Date(),
    shipping_address: '',
    shipping_method: '',
    payment_method: '',
    order_details: [],
    active: false
  }
  
  constructor(
    private orderService: OrderService,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private router: Router
  ){}
  ngOnInit(): void {
    debugger
    this.route.queryParams.subscribe((params) => {
      const id = 0;
      const vnp_ResponseCode = params['vnp_ResponseCode'];
      console.log("code: ",vnp_ResponseCode )
        // Thanh toán thành công
        this.paymentService.checkPayment(params).subscribe({
          next: (response: any) => {
            if (response.status === 'Accepted') {
              console.log('Thanh toán thành công:', response.message);
              debugger
              window.location.href = response.data;
              alert('Thanh toán thành công!');
            }
            
            
        },
        complete: () =>  {
          debugger
        },
          error: (err) => {
             if(vnp_ResponseCode === '24'){
              window.location.href =  "http://localhost:4200/";
              alert('Thanh toán thất bại, đơn hàng thanh toán khi nhận hàng.');
             }
             
            console.error('Lỗi khi kiểm tra thanh toán:', err);

          }
        });
     
      
  });
    this.getOrderDetails();
    

  }

  getOrderDetails(): void{
    debugger
    this.route.paramMap.subscribe( params => {
      const idParam =  params.get('id');
      if (idParam !== null) {
        this.orderId = +idParam;
      }
      if (!isNaN(this.orderId)) {
        this.orderService.getOrderById(this.orderId).subscribe({
          next: (response: any) => {
            debugger
            // console.log('response : ', response)
    
            this.orderResponse = {
              id: response.data.id,
              user_id: response.data.user_id,
              fullname: response.data.fullname,
              email: response.data.email,
              phone_number: response.data.phone_number,
              address: response.data.address,
              note: response.data.note,
              status: response.data.status,
              total_money: response.data.total_money,
              order_date: this.convertToDate(response.data.order_date),
              shipping_method: response.data.shipping_method,
              shipping_address: response.data.shipping_address,
              payment_method: response.data.payment_method,
              shipping_date: this.convertToDate(response.data.shipping_date),
              order_details: response.data.order_details.map((order_detail: any) => {
                order_detail.product.thumbnail = `${environment.apiBaseUrl}/products/images/${order_detail.product.thumbnail}`;
                order_detail.number_of_products = order_detail.numberOfProducts;
                return order_detail;
              }),
              active: response.data.active
            };
            console.log('thumnail: ',response.data.order_details)
          },
          complete: () => {
            debugger
          },
          error: (error: any) => {
            console.log('Error fetching order detail: ', error);
          }
        });
      }
      
    })
    
  }
  convertToDate(dateArray: any): Date {
    if (dateArray === null || !Array.isArray(dateArray) || dateArray.length !== 3) {
      return new Date();
    } else {
      return new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
    }
  }

  backHomePage(){
    this.router.navigate(['/']);
  }
}
