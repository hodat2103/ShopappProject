import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../responses/api.response';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiBaseUrl = `${environment.apiBaseUrl}/payments`;

  constructor(private http: HttpClient) { }

  createPayment(totalAmount: number, orderId: number): Observable<any> {
    const url = `${this.apiBaseUrl}/create-payment`;
    let params = new HttpParams()
    .set('total_money', totalAmount.toString())
    .set('order_id',orderId.toString())

    return this.http.get(url, { params });
  }
  checkPayment(queryParams: any): Observable<any> {
    const params = new HttpParams({ fromObject: queryParams });
    return this.http.get(`${this.apiBaseUrl}/check-payment`, { params });
  }
}