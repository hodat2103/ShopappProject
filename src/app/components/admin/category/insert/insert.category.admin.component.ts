import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CategoryService } from "../../../../services/category.service";
import { ProductService } from "../../../../services/product.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Category } from "../../../../models/category";
import { InsertCategoryDTO } from "../../../../dtos/category/insert.category.dto";
@Component({
    selector: 'app-insert-category-admin',
    templateUrl: './insert.category.admin.component.html',
    styleUrl: './insert.category.admin.component.scss'
  })
  export class InsertCategoryAdminComponent implements OnInit {
    insertCategoryDTO: InsertCategoryDTO = {
      name: '',    
    }
    categories: Category[] = [];
    constructor(    
      private router: Router,
      private categoryService: CategoryService,    
    ) {
      
    } 
    ngOnInit() {
      
    }   
  
    insertCategory() {    
      this.categoryService.insertCategory(this.insertCategoryDTO).subscribe({
        next: (response) => {
          debugger
          this.router.navigate(['/admin/categories']);
        },
        error: (error: HttpErrorResponse) => {
          debugger;
          console.error(error?.error?.message ?? '');
        }        
      });    
    }
  }
  