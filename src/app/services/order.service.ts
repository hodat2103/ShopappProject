import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Category } from "../models/category"; 
import { OrderDTO } from "../dtos/order.dto";
import { ApiResponse } from "../responses/api.response";

@Injectable({
    providedIn: 'root',
})
export class OrderService {
    private apiOrders = `${environment.apiBaseUrl}/orders`;
    private apiGetAllOrders = `${environment.apiBaseUrl}/orders/get-orders-by-keyword`;

    constructor(private http: HttpClient){}

    placeOrder(orderDTO: OrderDTO): Observable<ApiResponse>{
        return this.http.post<ApiResponse>(this.apiOrders, orderDTO);
    }
    getOrdersByUserId(userId: number): Observable<ApiResponse>{
        return this.http.get<ApiResponse>(`${this.apiOrders}/user/${userId}`);
    }
    getOrderById(orderId: number): Observable<any>{
        return this.http.get<any>(`${this.apiOrders}/${orderId}`);
    }
    getAllOrders(keyword:string,
        page: number, limit: number
      ): Observable<ApiResponse> {
          const params = new HttpParams()
          .set('keyword', keyword)      
          .set('page', page.toString())
          .set('limit', limit.toString());            
          return this.http.get<ApiResponse>(this.apiGetAllOrders, { params });
      }

    updateOrder(orderId: number, orderData: OrderDTO):Observable<any>{
        return this.http.put(`${this.apiOrders}/${orderId}`,orderData);
    }
    deleteOrder(orderId: number):Observable<any>{
        return this.http.delete(`${this.apiOrders}/${orderId}`,{responseType: 'text'});
    }
    showOrderDetails(orderId: number): Observable<any>{
        return this.http.get(`${environment.apiBaseUrl}/order_details/${orderId}`);

    }
}