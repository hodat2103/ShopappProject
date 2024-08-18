  import { Component, OnInit } from '@angular/core';
import { Order } from '../../../models/order';
import { OrderService } from '../../../services/order.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../responses/api.response';
import { Category } from '../../../models/category';
import { error } from 'console';
import { HttpErrorResponse } from '@angular/common/http';
import { ExcelService } from '../../../services/excel.service';
import { downloadFile } from '../../../util/file';

@Component({
  selector: 'app-category-admin',
  templateUrl: './category.admin.component.html',
  styleUrl: './category.admin.component.scss'
})
export class CategoryAdminComponent implements OnInit{
    categories: Category[]=[];
    constructor(private router: Router, 
      private categoryService: CategoryService,
      private excelService: ExcelService

    ){}
    ngOnInit(): void {
        this.getAllCategories(0,6);
    }
    getAllCategories(page: number, limit: number): void {
      this.categoryService.getCategories(page, limit).subscribe({
        next: (response: any) => {
         
            this.categories = response; 
          
        },
        error: (error: HttpErrorResponse) => {
          console.error(error?.error?.message ?? 'Error fetching categories');
        }
      });
    }
    insertCategory(){
      this.router.navigate(['admin/categories/insert']);
    }
    updateCategory(categoryId: number){
      this.router.navigate(['/admin/categories/update', categoryId]);

    }
    deleteCategory(category: Category){
      const confirmation = window
      .confirm('Are you sure you want to delete this category with id = ' + category.id);
      if (confirmation) {
        debugger
        this.categoryService.deleteCategory(category.id).subscribe({
          next: (apiResponse: ApiResponse) => {
            debugger 
            console.log('Delete Successfully')
            location.reload();          
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
    }
    export(dateName: string){
      this.excelService.exportExcel('categories').subscribe((blob: Blob) => {
        downloadFile(blob, 'categories.xlsx');
      }, error => {
        console.error('Error downloading the file', error);
      });
    }
}