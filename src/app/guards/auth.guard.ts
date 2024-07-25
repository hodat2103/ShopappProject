import { Injectable, inject } from "@angular/core";
import { TokenService } from "../services/token.service";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";


@Injectable({
    providedIn: 'root',
})
export class AuthGuard {
    constructor(private tokenService: TokenService,
        private router: Router
    ){}
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        const isTokenExpired = this.tokenService.isTokenExpired();
        const isUserValid = this.tokenService.getUserId() > 0;
        debugger
        if(!isTokenExpired && isUserValid){
            return true;
        }else{
            this.router.navigate(['/login']);
            return false;
        }
    }
    
}
export const AuthGuardFn: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    debugger
    return inject(AuthGuard).canActivate(next,state);
}