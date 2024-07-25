import { HttpErrorResponse } from "@angular/common/http"
import { ApiResponse } from "../../../../responses/api.response"
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { InsertProductDTO } from "../../../../dtos/product/insert.product.dto";
import { ActivatedRoute, Router } from "@angular/router";
import { CategoryService } from "../../../../services/category.service";
import { ProductService } from "../../../../services/product.service";
import { Category } from "../../../../models/category";
import { UpdateProductDTO } from "../../../../dtos/product/update.product.dto";

@Component({
  selector: 'app-insert-product-admin',
  templateUrl: './insert.product.admin.component.html',
  styleUrls: ['./insert.product.admin.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class InsertProductAdminComponent implements OnInit {
  insertProductDTO: InsertProductDTO = {
    name: '',
    price: 0,
    description: '',
    thumbnail: '',
    category_id: 1,
    images: []
  };
  categories: Category[] = []; // Dữ liệu động từ categoryService
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private productService: ProductService,
  ) {

  }
  ngOnInit() {
    this.getCategories(1, 100)
  }
  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (apiResponse: any) => {
        debugger;
        this.categories = apiResponse as Category[] || [];
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
  onFileChange(event: any) {
    // Retrieve selected files from input element
    const files = event.target.files;
    // Limit the number of selected files to 5
    if (files.length > 5) {
      console.error('Please select a maximum of 5 images.');
      return;
    }
    // Store the selected files in the newProduct object
    this.insertProductDTO.images = files;
  }

  // insertProduct() {    
  //   this.productService.insertProduct(this.insertProductDTO).subscribe({
  //     next: (apiResponse: any) => {
  //       debugger
  //       if (this.insertProductDTO.images.length > 0) {
  //         const productId = apiResponse.id; // Assuming the response contains the newly created product's ID
  //         this.productService.uploadImages(productId, this.insertProductDTO.images).subscribe({
  //           next: (imageResponse:any) => {
  //             debugger
  //             // Handle the uploaded images response if needed              
  //             console.log('Images uploaded successfully:', imageResponse);
  //             // Navigate back to the previous page
  //             this.router.navigate(['../'], { relativeTo: this.route });
  //           },
  //           error: (error: HttpErrorResponse) => {
  //             debugger;
  //             console.error(error?.error?.message ?? '');
  //           }
  //         })          
  //       }
  //     },
  //     error: (error: HttpErrorResponse) => {
  //       debugger;
  //       console.error(error?.error?.message ?? '');
  //     } 
  //   });    
  // }
  insertProduct(): void {
    this.productService.insertProduct(this.insertProductDTO).subscribe({
      next: (apiResponse: any) => {
        debugger;
        // Assuming the response contains the newly created product's ID

        if (this.insertProductDTO.images.length > 0) {
          const productId = apiResponse.id; 
          this.productService.uploadImages(productId, this.insertProductDTO.images).subscribe({
            next: (imageResponse: any) => {
              debugger;
              const thumbnailUrl = imageResponse[0].imageUrl;

              const updateProductDTO: UpdateProductDTO = {
                name: this.insertProductDTO.name,
                price: this.insertProductDTO.price,
                description: this.insertProductDTO.description,
                thumbnail: thumbnailUrl,
                category_id: this.insertProductDTO.category_id
              };

              this.productService.updateProduct(productId, updateProductDTO).subscribe({
                next: (updateResponse: any) => {
                  debugger;
                  console.log('Product updated successfully with thumbnail:', updateResponse);
                  this.router.navigate(['/admin/products']);
                },
                error: (error: HttpErrorResponse) => {
                  debugger;
                  console.error('Error updating product with thumbnail:', error?.error?.message ?? '');
                }
              });
            },
            error: (error: HttpErrorResponse) => {
              debugger;
              console.error('Error uploading images:', error?.error?.message ?? '');
            }
          });
        }
      },
      error: (error: HttpErrorResponse) => {
        debugger;
        console.error('Error inserting product:', error?.error?.message ?? '');
      }
    });
  }

}
