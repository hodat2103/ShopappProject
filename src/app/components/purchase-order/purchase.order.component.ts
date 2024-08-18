import { Component, Inject, OnInit } from '@angular/core';
import { Order } from '../../models/order';
import { TokenService } from '../../services/token.service';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { OrderDTO } from '../../dtos/order.dto';
import { OrderResponse } from '../../responses/orders/order.response';
import { ApiResponse } from '../../responses/api.response';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase.order.component.html',
  styleUrl: './purchase.order.component.scss'
})
export class PurchaseOrderComponent implements OnInit {
  currentPage: number = 0;
  visiblePages: number[] = [];
  totalPages: number = 0;
  keyword: string = '';
  orders: OrderResponse[] = [];
  userId: number = 0;

  constructor(private tokenService: TokenService,
    private orderService: OrderService,
    private router: Router,
  ) {

  }
  ngOnInit(): void {
    this.userId = this.tokenService.getUserId();
    this.getOrdersByUserId();
  }
  getOrdersByUserId() {
    debugger
    this.orderService.getOrdersByUserId(this.userId).subscribe({
      next: (apiResponse: ApiResponse) => {
        debugger
        this.orders = apiResponse.data;
        // console.log('active: ', apiResponse.data.order.active)
      },
      complete: () => {
        console.log('Get Ok');
      },
      error: (error: HttpErrorResponse) => {
        console.log('error', error?.error?.message);
      }
    })
  }
  searchOrders() {

  }
  onPageChange(index: number) {

  }
  viewDetails(order: OrderResponse) {

  }
  cancelOrder(order: OrderResponse) {
    console.log(order);
    const confirmation = window.confirm('Are you sure you want cancel this purchase order? ');
      if (confirmation) {
        switch (order.status) {
          case 'pending':
            const orderDTO = new OrderDTO({
              
              user_id: this.userId,
              fullname: order.fullname,
              email: order.email,
              phone_number: order.phone_number,  
              address: order.address,
              note: order.note,
              order_date: new Date(order.order_date).toISOString(),
              total_money: order.total_money,
              shipping_method: order.shipping_method,
              shipping_date: order.shipping_date,
              payment_method: order.payment_method,
              coupon_code: '',
              status: 'cancelled'
            });
            console.log('dto: ' ,orderDTO)
            this.orderService.updateOrder(order.id, orderDTO).subscribe({
              next: (response: any) => {
                console.log('Order updated', response);
                this.getOrdersByUserId(); // Refresh the order list after update
              },
              error: (error: HttpErrorResponse) => {
                console.error('Update error', error?.error?.message);
              }
            });
            break;
          case 'cancelled':
            debugger
            alert('Đơn hàng đã hủy rồi.');
            break;
          case 'processing':
            alert('Đơn hàng đang trong quá trình xử lý.');
            break;
          case 'shipped':
            alert('Đơn hàng đang được giao.');
            break;
          case 'delivered':
            alert('Đơn hàng đã giao thành công');
            break;
          
        }
      }
    
  }
  trackById(index: number, item: OrderResponse): number {
    return item.id;
  }
}
