import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { environment } from '../../environments/environment';
import { ProductService } from '../../services/product.service';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';
import { ApiResponse } from '../../responses/api.response';
import { TokenService } from '../../services/token.service';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../responses/users/user.detail.response';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  products: Product[] = [];
  categories: Category[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 15;
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = '';
  selectedCategoryId: number = 0;
  token: string | null = '';
  userResponse?: UserResponse;

  constructor(
    private productService: ProductService, 
    private categoryService: CategoryService,
    private tokenService: TokenService,
    private userService: UserService,
    private router: Router,
    
  ) { }

  ngOnInit(): void {
    this.checkRole();
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    this.getCategories(1, 100);
  }

  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (apiResponse: ApiResponse) => {
        this.categories = apiResponse.data;
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
      }
    });
  }
  checkRole(){
    debugger
    this.token = this.tokenService.getToken();
    if(this.token !== null){
      this.userService.getUserDetail(this.token).subscribe({
        next: (response: any) => {
          debugger
          this.userResponse = response;
          if(this.userResponse?.role.name === 'admin'){
            this.router.navigate(['admin']);
          }
        }
      })
    }
    
  }
  searchProducts(): void {
    this.currentPage = 0;
    this.itemsPerPage = 15;
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }

  getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number){
    this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
      next: (response: any) => {
        response.products.forEach((product: Product) => {
          product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
        });
        
        this.products = response.products;
        console.log('Products: ', this.products);
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      error: (error: any) => {
        console.error('Error fetching products: ', error);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
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

    return new Array(endPage - startPage + 1).fill(0).map((value, index) => startPage + index);
  }

  onProductClick(productId: number): void {
    debugger
    if (productId) {
      this.router.navigate(['/products', productId]);
    } else {
      console.error('Product ID is undefined');
    }  }
}
