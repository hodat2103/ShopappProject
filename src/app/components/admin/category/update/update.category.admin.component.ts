import { Component, OnInit } from "@angular/core";
import { ApiResponse } from "../../../../responses/api.response";
import { HttpErrorResponse } from "@angular/common/http";
import { UpdateCategoryDTO } from "../../../../dtos/category/update.category.dto";
import { CategoryService } from "../../../../services/category.service";
import { Category } from "../../../../models/category";
import { ActivatedRoute, Router} from "@angular/router";
@Component({
    selector: 'app-update-category-admin',
    templateUrl: './update.category.admin.component.html',
    styleUrl: './update.category.admin.component.scss'
  })
  export class UpdateCategoryAdminComponent implements OnInit {
    categoryId: number;
    updatedCategory: Category;
    
    constructor(
      private categoryService: CategoryService,
      private route: ActivatedRoute,
      private router: Router,
    
    ) {
      this.categoryId = 0;    
      this.updatedCategory = {} as Category;  
    }
  
    ngOnInit(): void {    
      this.route.paramMap.subscribe(params => {
        debugger
        this.categoryId = Number(params.get('id'));
        this.getCategoryDetails();
      });
      
    }
    
    getCategoryDetails(): void {
      this.categoryService.getDetailCategory(this.categoryId).subscribe({
        next: (response: any) => { 
        debugger       
          this.updatedCategory = response; 
          console.log('name: ' + this.updatedCategory.name)                       
        },
        complete: () => {
          
        },
        error: (error: HttpErrorResponse) => {
          debugger;
          console.error(error?.error?.message ?? '');
        } 
      });     
    }
    updateCategory() {
      const updateCategoryDTO: UpdateCategoryDTO = {
        name: this.updatedCategory.name,      
      };
      this.categoryService.updateCategory(this.updatedCategory.id, updateCategoryDTO).subscribe({
        next: (response: any) => {  
          debugger        
        },
        complete: () => {
          debugger;
          this.router.navigate(['/admin/categories']);        
        },
        error: (error: HttpErrorResponse) => {
          debugger;
          console.error(error?.error?.message ?? '');
        } 
      });  
    }  
  }