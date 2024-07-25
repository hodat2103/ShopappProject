import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { UserResponse } from '../../responses/users/user.detail.response';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  // adminComponent: string = 'orders';
  userResponse?: UserResponse  | null;
  constructor( private userService: UserService,
               private tokenService: TokenService,
               private router: Router
  ) { }
  ngOnInit(): void {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    //console.log('ngOnInit called', this.userResponse); // Add this
    if (this.router.url === '/admin') {
      //console.log('Navigating to /admin/orders'); // Add this
      this.router.navigate(['/admin/orders']);
    }
  }
  logout() {
    this.userService.removeUserFromLocalStorage();
    this.tokenService.removeToken();
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    this.router.navigate(['/login']);

  }
  // showAdminComponent(componentName: string): void {
  //   this.adminComponent = componentName;
  // }
  showAdminComponent(componentName: string): void {
    debugger
    if (componentName === 'orders') {
      this.router.navigate(['/admin/orders']);
    } else if (componentName === 'categories') {
      this.router.navigate(['/admin/categories']);
    } else if (componentName === 'products') {
      this.router.navigate(['/admin/products']);
    } else if (componentName === 'users') {
      this.router.navigate(['/admin/users']);
    }
  }
}