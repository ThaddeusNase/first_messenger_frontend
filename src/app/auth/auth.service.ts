import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators'
import { User } from '../shared/user.model';
import { Router } from '@angular/router';


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
  currentUser =  new BehaviorSubject<User>(null);


  register(email: string, password: string) {
    const userLoginData = {"email": email, "password": password}
    
    return this.http.post<AuthResponseData>("http://127.0.0.1:5000/register_user",userLoginData, 
    {
      // HEADER-config:
      headers: new HttpHeaders({"Content-Type": "application/json"})
    }
    ).pipe(tap(this.handleAuthentication.bind(this)))
  }


  login(email: string, password: string) {
    return this.http.post<AuthResponseData>("http://127.0.0.1:5000/auth",
      {
        "email": email,
        "password": password
      }
    ).pipe(tap(this.handleAuthentication.bind(this)))
  }

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


  


}


