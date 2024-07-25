import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { environment } from '../../../environments/environment';
import { OrderDTO } from '../../../dtos/order.dto';
import { OrderResponse } from '../../../responses/orders/order.response';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../../../responses/api.response';

@Component({
  selector: 'app-detail-order-admin',
  templateUrl: './detail.order.admin.component.html',
  styleUrls: ['./detail.order.admin.component.scss']
})
export class DetailOrderAdminComponent implements OnInit {
  orderId: number = 0;
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
    shipping_method: '',
    shipping_address: '',
    shipping_date: new Date(),
    payment_method: '',
    order_details: []
  };

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getOrderDetails();
  }

  getOrderDetails(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('id: ' + this.orderId)
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (response: any) => {
        this.orderResponse = {
          id: response.id,
          user_id: response.user_id,
          fullname: response.fullname,
          email: response.email,
          phone_number: response.phone_number,
          address: response.address,
          note: response.note,
          status: response.status,
          total_money: response.total_money,
          order_date: this.convertToDate(response.order_date),
          shipping_method: response.shipping_method,
          shipping_address: response.shipping_address,
          payment_method: response.payment_method,
          shipping_date: this.convertToDate(response.shipping_date),
          order_details: response.order_details.map((order_detail: any) => {
            order_detail.product.thumbnail = `${environment.apiBaseUrl}/products/image/thumbnail/${order_detail.product.id}`;
            order_detail.number_of_products = order_detail.numberOfProducts;
            return order_detail;
          })
        };
      },
      error: (error: any) => {
        console.error('Error fetching detail: ', error);
      }
    });
  }

  convertToDate(dateArray: any): Date {
    if (dateArray === null || !Array.isArray(dateArray) || dateArray.length !== 3) {
      return new Date();
    } else {
      return new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
    }
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  saveOrder(): void {
    console.log('status: '+this.orderResponse.status);
    debugger        
    this.orderService
      .updateOrder(this.orderId, new OrderDTO(this.orderResponse))
      .subscribe({
      next: (response: OrderResponse) => {
        debugger
        
        //Handle the successful update
        console.log('Order updated successfully:', response);
        //Navigate back to the previous page
        this.router.navigate(['/admin/orders']);       
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      complete: () => {
        debugger;        
      },
      error: (error: HttpErrorResponse) => {
        debugger;
        console.error(error?.error?.message ?? '');
        this.router.navigate(['../'], { relativeTo: this.route });
      }       
    });   
  }

  getFormattedOrderDate(): string {
    return this.formatDate(this.orderResponse.order_date);
  }

  getFormattedShippingDate(): string {
    return this.formatDate(this.orderResponse.shipping_date);
  }
}
