import { Component, OnInit } from "@angular/core";
import { UserService } from "../../../services/user.service";
import { ApiResponse } from "../../../responses/api.response";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
    selector: 'app-forget-password',
    templateUrl: 'forget.password.component.html',
    styleUrls:['forget.password.component.scss']
})
export class ForgetPasswordComponent implements OnInit{
    email: string = '';
    constructor(private userService: UserService){}
    ngOnInit(): void {
        
    }
    onEmailChange(){
        console.log(`Phone typed: ${this.email}`);
    }
    resetPassword() {
    this.userService.resetPassword(this.email).subscribe({
      next: (apiResponse: ApiResponse) => {
        console.error('Reset password successfully');
        //location.reload();
      },
      complete: () => {
        // Handle complete event
        alert('Send require successfully');
      },
      error: (error: HttpErrorResponse) => {
        debugger;
        console.error(error?.error?.message ?? '');
        alert(error?.error?.message ?? '');
      } 
    });
  }
}