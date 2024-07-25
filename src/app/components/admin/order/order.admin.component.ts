import { Component, OnInit } from '@angular/core';
import { Order } from '../../../models/order';
import { OrderService } from '../../../services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderResponse } from '../../../responses/orders/order.response';
import { ApiResponse } from '../../../responses/api.response';

@Component({
  selector: 'app-order-admin',
  templateUrl: './order.admin.component.html',
  styleUrls: ['./order.admin.component.scss']
})
export class OrderAdminComponent implements OnInit {
  orderResponse?: OrderResponse;
  orders: Order[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 15;
  pages: number[] = [];
  totalPages: number = 0;
  keyword: string = '';
  visiblePages: number[] = [];
  localStorage?:Storage;

  constructor(private orderService: OrderService, private router: Router,
    private route: ActivatedRoute,
      // private location: Location
  ) { 
    this.localStorage = document.defaultView?.localStorage;
  }

  ngOnInit(): void {
    this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
  }

  getAllOrders(keyword: string, page: number, limit: number){
    this.orderService.getAllOrders(keyword, page, limit).subscribe({
      next: (response: any) => {
        this.orders = response.orders;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
   },
      error: (error: any) => {
        console.error('Error fetching orders: ', error);
      }
    });
  }
  // getAllOrders(keyword: string, page: number, limit: number){
  //   this.orderService.getAllOrders(keyword, page, limit).subscribe({
  //     next: (apiResponse: ApiResponse) => {
  //       this.orders = apiResponse.data.orders;
  //       this.totalPages = apiResponse.data.totalPages;
  //       this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
  //  },
  //     error: (error: any) => {
  //       console.error('Error fetching orders: ', error);
  //     }
  //   });
  // }

  onPageChange(page: number) {
    debugger;
    this.currentPage = page < 0 ? 0 : page;
    this.localStorage?.setItem('currentOrderAdminPage', String(this.currentPage));         
    this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1).fill(0).map((value, index) => startPage + index);
  }

  viewDetails(order: Order): void {
    this.router.navigate(['/admin/orders', order.id]);
  }
searchOrders() {
    this.currentPage = 0;
    this.itemsPerPage = 12;
    //Mediocre Iron Wallet
    debugger
    this.getAllOrders(this.keyword.trim(), this.currentPage, this.itemsPerPage);
  }
  deleteOrder(orderId: number): void {
    const confirmation = window
      .confirm('Are you sure you want to delete this order with id = ' + orderId);
    if (confirmation) {
    this.orderService.deleteOrder(orderId).subscribe({
      next: (response: any) => {
        // Xóa đơn hàng khỏi danh sách hiện tại
        this.orders = this.orders.filter(order => order.id !== orderId);
        this.totalPages = Math.ceil(this.orders.length / this.itemsPerPage);
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      error: (error: any) => {
        console.error('Error deleting order: ', error);
      }
    });
  }
  }
  trackById(index: number, item: Order): number {
    return item.id;
  }
}
