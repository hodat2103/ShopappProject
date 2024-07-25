import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterDTO } from '../dtos/register.dto';
import { LoginDTO } from '../dtos/user/login.dto';
import { environment } from '../environments/environment';
import { UserResponse } from '../responses/users/user.detail.response';
import { UpdateUserDTO } from '../dtos/user/update.user.profile.dto';
import { ApiResponse } from '../responses/api.response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiRegister = `${environment.apiBaseUrl}/users/register`;
  private apiLogin = `${environment.apiBaseUrl}/users/login`;
  private apiUserDetail = `${environment.apiBaseUrl}/users/details`;
  private apiConfig = {
    headers: this.createHeaders(),
  }

  constructor(private http: HttpClient) { }

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'vi'
    });
  }

  register(registerDTO: RegisterDTO): Observable<any> {
    return this.http.post(this.apiRegister, registerDTO, this.apiConfig);
  }

  login(loginDTO: LoginDTO): Observable<any> {
    return this.http.post(this.apiLogin, loginDTO, this.apiConfig);
  }

  getUserDetail(token: string) {
    return this.http.post(this.apiUserDetail, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    });
  }

  updateUserDetail(userId: number, token: string, updateUserDTO: UpdateUserDTO): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const url = `${this.apiUserDetail}/${userId}`;
    return this.http.put(url, updateUserDTO, { headers });
  }


  saveUserResponseToLocalStorage(userResponse?: UserResponse) {
    try {
      if (userResponse == null || !userResponse) {
        return;
      }
      const userResponseJson = JSON.stringify(userResponse);

      localStorage.setItem('user', userResponseJson);

      // console.log('User response saved to local storage.');
    } catch (error) {
      console.log('Error saving user response to local storage.', error);

    }
  }
  getUserResponseFromLocalStorage(): UserResponse | null {
    try {
      const userResponseJson = localStorage.getItem('user');
      if (userResponseJson == null || !userResponseJson) {
        return null;
      }
      const userResponse = JSON.parse(userResponseJson!);

      // console.log('User response retrived from local storage.');

      return userResponse;
    } catch (error) {
      console.log('Error retriving user response from local storage.', error);
      return null;
    }
  }
  removeUserFromLocalStorage(): void {
    try {
      localStorage.removeItem('user');
      // console.log('User data removed from local storage')
    } catch (error) {
      console.log('Error removing user data from local strage: ', error);
    }
  }
  getUsers(params: { page: number, limit: number, keyword: string }): Observable<ApiResponse> {
    const url = `${environment.apiBaseUrl}/users`;
    return this.http.get<ApiResponse>(url, { params: params });
  }
  resetPassword(userId: number): Observable<ApiResponse> {
    const url = `${environment.apiBaseUrl}/users/reset-password/${userId}`;
    return this.http.put<ApiResponse>(url, null, this.apiConfig);
  }

  toggleUserStatus(params: { userId: number, enable: boolean }): Observable<ApiResponse> {
    const url = `${environment.apiBaseUrl}/users/block/${params.userId}/${params.enable ? '1' : '0'}`;
    return this.http.put<ApiResponse>(url, null, this.apiConfig);
  }
}
