import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { RoleService } from '../../services/role.service';
import { Role } from '../../models/role';
import { LoginDTO } from '../../dtos/user/login.dto';
import { LoginResponse } from '../../responses/users/login.response';
import { UserResponse } from '../../responses/users/user.detail.response';
import { error } from 'console';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] // Note the plural here
})
export class LoginComponent implements OnInit{
  @ViewChild('loginForm') loginForm!: NgForm;

  // login user
  //  phoneNumber: string = '12345678'; 
  //  password: string = '12345678'; 

  // phoneNumber: string = '0334204369'; 
  // password: string = '123456';
  phoneNumber: string = ''; 
  password: string = '';
  
  roles: Role[] = [];
  rememberMe: boolean = true;
  selectedRole: Role | undefined;
  userResponse?: UserResponse;
  constructor(
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService,
    private roleService: RoleService,
  ) {}

    ngOnInit() {
      this.roleService.getRoles().subscribe({
        next: (roles: Role[]) => {
          console.log('Roles loaded:', roles); // Debugging log
          this.roles = roles;
          this.selectedRole = roles.length > 0 ? roles[0] : undefined;
        },
        error: (error: any) => {
          console.error('Error getting roles: ', error);
        }
      });
    }

  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`);
  }

  login() {
    debugger
    const loginDTO: LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password,
      role_id: this.selectedRole?.id ?? 1
    };

    this.userService.login(loginDTO).subscribe({
      next: (response: LoginResponse) => {
        // debugger
        const { token } = response;
        if (this.rememberMe) {
          this.tokenService.setToken(token);
          this.userService.getUserDetail(token).subscribe({
            next: (response: any) => {
              debugger
              this.userResponse = {
                ...response,
                date_of_birth: new Date(response.date_of_birth)
              };
            this.userService.saveUserResponseToLocalStorage(this.userResponse);
            if(this.userResponse?.role.name == 'admin'){
              this.router.navigate(['/admin']);
            }else if(this.userResponse?.role.name == 'user') {
              this.router.navigate(['/']);

            }

            },
            complete: () => {
              debugger
            },
            error: (error: any) => {
              debugger
              alert(error.error.message);
            }

          })
        }
      },
      complete: () =>{
        debugger;
      },
      error: (error: any) => {
        alert(error?.error?.message);
      }
    });
  }
  register(){
    this.router.navigate(['/register']);  
  }
}
