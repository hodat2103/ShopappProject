import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class JwtHelperService {
  constructor() {}

  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);
      if (decoded && decoded.exp) {
        const expiryDate = new Date(0);
        expiryDate.setUTCSeconds(decoded.exp);
        return expiryDate.valueOf() < new Date().valueOf();
      }
      return false;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }
}
