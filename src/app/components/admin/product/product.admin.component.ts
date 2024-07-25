import { Component, Inject, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

import { Location } from '@angular/common';
import { Product } from '../../../models/product';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '../../../responses/api.response';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-product-admin',
  templateUrl: './product.admin.component.html',
  styleUrls: [
    './product.admin.component.scss',        
  ],
  // standalone: true,
  // imports: [   
  //   CommonModule,
  //   FormsModule,
  // ]
})
export class ProductAdminComponent implements OnInit {
    selectedCategoryId: number  = 0; // Giá trị category được chọn
    products: Product[] = [];        
    currentPage: number = 0;
    itemsPerPage: number = 12;
    pages: number[] = [];
    totalPages:number = 0;
    visiblePages: number[] = [];
    keyword:string = "";
    localStorage?:Storage;

    private productService = inject(ProductService);
    private router = inject(Router);
    private location = inject(Location);

    constructor(
      @Inject(DOCUMENT) private document: Document
    ) {
      this.localStorage = document.defaultView?.localStorage;
    }
    ngOnInit() {
      this.currentPage = Number(this.localStorage?.getItem('currentProductAdminPage')) || 0; 
      this.getProducts(this.keyword, 
        this.selectedCategoryId, 
        this.currentPage, this.itemsPerPage);      
    }    
    searchProducts() {
      this.currentPage = 0;
      this.itemsPerPage = 12;
      //Mediocre Iron Wallet
      debugger
      this.getProducts(this.keyword.trim(), this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    }
    getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {
      debugger;
      this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
        next: (response: any) => {
          debugger;
          const products = response.products as Product[] || [];
          const totalPages = response.totalPages || 0;
          
          products.forEach((product: Product) => {                      
            if (product) {
              debugger
              product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
              // console.log('url: ', product.url);
            }          
          });
          this.products = products;
          this.totalPages = totalPages;
          this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
        },
        complete: () => {
          debugger;
        },
        error: (error: HttpErrorResponse) => {
          debugger;
          console.error(error?.error?.message ?? '');
        }
      });
    }
    
    onPageChange(page: number) {
      debugger;
      this.currentPage = page < 0 ? 0 : page;
      this.localStorage?.setItem('currentProductAdminPage', String(this.currentPage));     
      this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    }
  
    generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
      const maxVisiblePages = 5;
      const halfVisiblePages = Math.floor(maxVisiblePages / 2);
    
      let startPage = Math.max(currentPage - halfVisiblePages, 1);
      let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);
    
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(endPage - maxVisiblePages + 1, 1);
      }
    
      return new Array(endPage - startPage + 1).fill(0)
        .map((_, index) => startPage + index);
    }
    
    insertProduct() {
      debugger
      this.router.navigate(['/admin/products/insert']);
    } 

    updateProduct(productId: number) {
      debugger
      this.router.navigate(['/admin/products/update', productId]);
    }  
    deleteProduct(product: Product) {
      const confirmation = window.confirm('Are you sure you want to delete this product with id = ' + product.id);
      if (confirmation) {
        this.productService.deleteProduct(product.id).subscribe({
          next: (response: string) => {
            
              console.log('Delete successfully');
              this.router.navigate(['/admin/products']);
              location.reload();
            },  
          error: (error: HttpErrorResponse) => {
            console.error('Error deleting product:', error.message);
          }
        });
      }
    }   
}