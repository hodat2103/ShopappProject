import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../responses/users/user.detail.response';
import { CartService } from '../../services/cart.service';
import { TokenService } from '../../services/token.service';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userResponse?: UserResponse | null;
  isPopoverOpen = false;
  activeNavItem: number = 0;

  constructor(private userService: UserService,
    private popoverConfig: NgbPopoverConfig,
    private cartService: CartService,
    private tokenService: TokenService,
    private router: Router) {
  }
  ngOnInit() {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
  }

  togglePopover(event: Event): void {
    event.preventDefault();
    this.isPopoverOpen = !this.isPopoverOpen;
  }

  handleItemClick(index: number) : void{
    if(index === 0){
      this.router.navigate(['/user-profile']);
    }else if(index === 1){
      this.router.navigate(['/purchase-orders',this.tokenService.getUserId()]);
    }else if (index === 2) {
      this.userService.removeUserFromLocalStorage();
      this.tokenService.removeToken();
      this.userResponse = this.userService.getUserResponseFromLocalStorage();
      this.router.navigate(['/login']);
    }
    this.isPopoverOpen = false;
  }


  setActiveNavItem(index: number) {
    this.activeNavItem = index;
  }
}
