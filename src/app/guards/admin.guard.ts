import { Injectable, inject } from "@angular/core";
import { TokenService } from "../services/token.service";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { UserService } from "../services/user.service";
import { UserResponse } from "../responses/users/user.detail.response";


@Injectable({
    providedIn: 'root',
})
export class AdminGuard {
    userResponse?: UserResponse | null;
    constructor(private tokenService: TokenService,
        private router: Router,
        private userService: UserService
    ){}
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        const isTokenExpired = this.tokenService.isTokenExpired();
        const isUserValid = this.tokenService.getUserId() > 0;
        this.userResponse = this.userService.getUserResponseFromLocalStorage();
        const isAdmin = this.userResponse?.role.name == 'admin';
        debugger
        if(!isTokenExpired && isUserValid && isAdmin){
            return true;
        }else{
            this.router.navigate(['/login']);
            return false;
        }
    }
    
}
export const AdminGuardFn: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
    debugger
    return inject(AdminGuard).canActivate(next,state);
}
