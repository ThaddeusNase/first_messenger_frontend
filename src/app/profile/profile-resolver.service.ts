import { TOUCH_BUFFER_MS } from "@angular/cdk/a11y";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { UserResponseData, UsersService } from "../shared/services/users.service";


@Injectable({providedIn: "root"})
export class ProfileResolverService implements Resolve<UserResponseData> {
    constructor(private usersService: UsersService) {
    }

    // MARK: WICHTIG = s. this.usersService.fetchUserByUid() ... .pipe(catchError(this.handleErrors) )
    // Observable kann somit auch string(==ErrorMessage) oder UserResponseData zurückgeben
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserResponseData> | Promise<UserResponseData> | UserResponseData   {
        const url = route.url
        const uid: string = url[1].path
        console.log(url);
        
        console.log("---selected UserId: ", uid);
        
        return this.usersService.fetchUserByUid(uid)
    }
    

}