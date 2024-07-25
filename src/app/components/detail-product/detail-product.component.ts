import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { environment } from '../../environments/environment';
import { ProductImage } from '../../models/product.image';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})
export class DetailProductComponent implements OnInit {
  product?: Product;
  productId: number = 0;
  currentImageIndex: number = 0;
  quantity: number = 1;

  constructor(private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // this.cartService.clearCart();
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam !== null) {
        this.productId = +idParam;
      }
      if (!isNaN(this.productId)) {
        this.productService.getDetailProduct(this.productId).subscribe({
          next: (response: any) => {
            if (response.productImages && response.productImages.length > 0) {
              response.productImages.forEach((product_image: ProductImage) => {
                product_image.imageUrl = `${environment.apiBaseUrl}/products/images/${product_image.imageUrl}`;
              });
            }
            this.product = response;
            this.showImage(0);
          },
          error: (error: any) => {
            console.error('Error fetching detail: ', error);
          }
        });
      } else {
        console.error('Invalid productId: ', idParam);
      }
    });
  }

  showImage(index: number): void {
    if (this.product && this.product.productImages && this.product.productImages.length > 0) {
      if (index < 0) {
        index = 0;
      } else if (index >= this.product.productImages.length) {
        index = this.product.productImages.length - 1;
      }
      this.currentImageIndex = index;
    }
  }

  thumbnailClick(index: number): void {
    this.showImage(index);
  }

  nextImage(): void {
    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {
    this.showImage(this.currentImageIndex - 1);
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addtoCart(this.productId, this.quantity);
      alert(`Thêm vào giỏ hàng thành công sản phẩm: ` + this.product.name);
    } else {
      console.error('Không thể thêm giỏ hàng vì sản phẩm không có');
      alert(`Thêm vào giỏ hàng thất bại!`);
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  buyNow(): void {
    this.router.navigate(['/orders'])
  }
}
