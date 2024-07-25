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

@Component({
  selector: 'app-order-detail',
  templateUrl: './order.detail.component.html',
  styleUrl: './order.detail.component.scss'
})
export class OrderDetailComponent implements OnInit{
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
    order_details: []
  }
  
  constructor(private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ){}
  ngOnInit(): void {
    
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
    
            this.orderResponse.id = response.id;
            this.orderResponse.user_id = response.user_id;
            this.orderResponse.fullname = response.fullname;
            this.orderResponse.phone_number = response.phone_number;
            this.orderResponse.email = response.email;
            this.orderResponse.address = response.address;
            this.orderResponse.note = response.note;
            this.orderResponse.order_date = new Date(
              response.order_date[0],
              response.order_date[1] - 1,
              response.order_date[2]
            );
            debugger
            this.orderResponse.order_details = response.order_details.map((order_detail: OrderDetailDTO) => {
              console.log('quantity:' ,order_detail.numberOfProduct);
              console.log('price:' ,order_detail.price);
              console.log('total:' ,order_detail.product.price * order_detail.numberOfProduct);
    
              order_detail.product.thumbnail = `${environment.apiBaseUrl}/products/images/${order_detail.product.thumbnail}`;
              return order_detail;
    
            });
            this.orderResponse.shipping_method = response.shipping_method;
            this.orderResponse.payment_method = response.payment_method;
            this.orderResponse.shipping_date = new Date(
              response.order_date[0],
              response.order_date[1] - 1,
              response.order_date[2]
            );
            this.orderResponse.status = response.status;
            this.orderResponse.total_money = response.total_money;
            console.log('orderResponse: ', this.orderResponse)
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
  backHomePage(){
    this.router.navigate(['/']);
  }
}
