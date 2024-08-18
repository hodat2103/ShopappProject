import { Injectable } from "@angular/core";
import { ProductService } from "./product.service";
import { Product } from "../models/product";

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: Map<number, number> = new Map();

  constructor(private productService: ProductService){
    // Check if localStorage is available
    if (this.isLocalStorageAvailable()) {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        this.cart = new Map(JSON.parse(storedCart));
      }
    }
  }

  addtoCart(productId: number, quantity: number = 1): void {
    if (this.cart.has(productId)) {
      console.log('service: ',productId)
      this.cart.set(productId, this.cart.get(productId)! + quantity);
    } else {
      console.log('service: ',productId)
      this.cart.set(productId, quantity);
    }

    this.saveCartToLocalStorage();
  }
  loadCart(): void {
    const storedCartItems = localStorage.getItem('cart');
    if (storedCartItems) {
      this.cart = new Map(JSON.parse(storedCartItems));
    }
  }
  removeFromCart(productId: number): void {
    if (this.cart.has(productId)) {
      this.cart.delete(productId);
      this.saveCartToLocalStorage();
    }
  }
  getCart(): Map<number, number> {
    return this.cart;
  }
  setCart(cart : Map<number, number>) {
    this.cart = cart ?? new Map<number, number>();
    this.saveCartToLocalStorage();
  }
  private saveCartToLocalStorage(): void {
    // Check if localStorage is available
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('cart', JSON.stringify(Array.from(this.cart.entries())));
      console.log(localStorage);
    }
  }
  // updateCart(cartItems: Array<{ product: Product, quantity: number }>) {
  //   this.cart = cartItems;
  // }
  clearCart(): void {
    this.cart.clear();
    this.saveCartToLocalStorage();
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
}
