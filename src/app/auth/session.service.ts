import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as io from 'socket.io-client';
import { User } from '../shared/user.model';


export interface LocalStorageUserData {
    email: string, 
    id: number,
    _expirationDate: string, 
    _token: string
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {

    socket; 
    socketPrivate;
    userData: {emai}

    constructor(private http: HttpClient){}

    // ----- SOCKET-IO CONFIG -----
    setupSocketConnection() {
        this.socket = io("localhost:5000")                  // verwenden wenn neuer CLieint sich mit socket-server verbindet (request.sid wert wird generiert)
        this.socketPrivate = io("localhost:5000/private")
    }

    // userData als Parameter, da s. this.authService.currentUser.subscribe == circular dependency!!! 
    createSession() {
        const userData = JSON.parse(localStorage.getItem("userData"))
        const jwt_token_expirationDate = userData._expirationDate
        if (!this.socket || !this.socketPrivate) {
            throw new Error("wasn't able to connect to socket-server")
        }
        this.socketPrivate.emit("email", userData.email, jwt_token_expirationDate)
    }
    
    // TODO: getSession() http request -> dann in sessionExist() callen
    getSession() {
        
    }

    deleteSession(user_id: string) {
        
        this.http.delete<string>(
            `http://127.0.0.1:5000/session/${user_id}`
        ).pipe(catchError(this.handleErrors)).subscribe(
            (message: string) => {
                console.log(message)
            }
        )
    }

    handleErrors(errorResponse: HttpErrorResponse) {

        let errorMessage = "unknown error occured (not in HttpErrorResponse )"
        if (!errorResponse.error.message || errorResponse.error ) {
            return throwError(errorMessage)
        }

        switch (errorResponse.error.message) {
            case "NO_SESSION_FOR_USER_EXIST":
                errorMessage = "current user has no valid session"
                break;
            case "UNKNOWN_SERVER_ERROR":
                errorMessage = "unknown server error occured (flask backend side)"
        
            default:
                errorMessage = "another unknown error occured -> s. default-case!"
                break;
        }

        throwError(errorMessage)
    }

    // check if session already exist for the user
    // TODO: in chatSessionGuardService
    sessionExists() {
        
        return false
    }

}
