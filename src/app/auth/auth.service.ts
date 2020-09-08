import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators'
import { User } from '../shared/user.model';
import { Router } from '@angular/router';

// TODO: ----------------------------------------
// localStorage + autologin/logout
// error Handeling (fehler testen: LOGIN (was wenn email nicht registriert), email bereits registriert, etc. )
// ----------------------------------------------


export interface AuthResponseData {
  email: string,
  token: string,
  id: string,
  expiresIn: string, 
  // TODO: json == string or number?!
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  // currentUser wird benötigt für weitere reuests zB Freunde/ChatPartner adden oder für Chat-funktion()nachrichten scrheiben etc
  // allgm für funktionen für die man eingeloggt/authentifiziert sein muss
  // dann currentUser.(pipe(take(1), exhaustMap(...))).subscripe()
  currentUser =  new BehaviorSubject<User>(null);


  register(email: string, password: string) {
    const userLoginData = {"email": email, "password": password}
    
    return this.http.post<AuthResponseData>("http://127.0.0.1:5000/register_user",userLoginData, 
    {
      // HEADER-config:
      headers: new HttpHeaders({"Content-Type": "application/json"})
    }
    ).pipe(catchError(this.handleErrors) ,tap(this.handleAuthentication.bind(this)))
  }


  login(email: string, password: string) {
    return this.http.post<AuthResponseData>("http://127.0.0.1:5000/auth",
      {
        "email": email,
        "password": password
      }
    ).pipe(catchError(this.handleErrors),tap(this.handleAuthentication.bind(this)))
  }


  // ------ HELPER ------
  handleAuthentication(resData: AuthResponseData) {
    console.log("hanleAuthendtication executed");
    
    const expiresIn = +resData.expiresIn * 1000
    const currentTime = new Date().getTime()
    const expirationDate = new Date(expiresIn + currentTime)
    
    const newUser = new User(resData.email, resData.id, resData.token, expirationDate)
    this.currentUser.next(newUser)
    this.router.navigate(["home"])
    // TODO: localStorage.setItem("userData", JSON.stringify(newUser))
  }

  private handleErrors(responseError: HttpErrorResponse) {
    let errorMessage = "Unknown Error occoured"

    if (!responseError.error || !responseError.error.message) {
      return throwError(responseError)
    }

    switch (responseError.error.message) {
      case "EMAIL_EXISTS":
        console.log("email already exists");
        errorMessage = "email already exists"
        break;
      case "UNKNOWN_SERVER_ERROR":
        console.log("An wild unknown Server-Error appeared (Error im Flask Backend)");
        errorMessage = "An wild unknown Server-Error appeared"
        break;
      case "EMAIL_DOES_NOT_EXIST":
        errorMessage = "Email is not registered. Click below to register";
        break;
      case "INCORRECT_PASSWORD":
        errorMessage = "The password was incorrect";
        break;         
      default:
        errorMessage = "Unknown Error occoured (default)"
        console.log(responseError);
        
        break;
    }
    return throwError(errorMessage)
  }


}


