import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Location } from '@angular/common';

@Injectable({
    providedIn: "root"
})
export class AuthFormGuardService implements CanActivate {
    constructor(private authService: AuthService, private location: Location ) {}

    // wird cabActivate aufgerufen sobald AuthFormGuardService klasse init wird?
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | boolean {
        console.log("---canActivated executed");
        if (this.authService.isAuthenticated()) {
            // router.navigate .. (lastCurrentRoute)
            this.location.back()
            return false
        } else {
            return true
        }

    }
    
} 