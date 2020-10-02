import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterState, RouterStateSnapshot } from "@angular/router";
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable({providedIn: "root"})
export class AuthGuardService implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | boolean {
        if (this.authService.isAuthenticated()) {
            return true
        }
        this.router.navigate(["/auth"])
    }
} 