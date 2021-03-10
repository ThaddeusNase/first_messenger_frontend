import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { Session } from 'protractor';
import { throwError } from 'rxjs';
// import { lastValueFrom } from 'rxjs/operators';
import { catchError, map } from 'rxjs/operators';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment'; 


// TODO: alle Observables/Http Requests unsubscriben: 
// s. https://stackoverflow.com/questions/35042929/is-it-necessary-to-unsubscribe-from-observables-created-by-http-methods


export interface SessionResponseData {
    sid: string, 
    uid: number,
    expiration_date: string,
    session_expired: boolean
}


@Injectable({
  providedIn: 'root'
})
export class SessionService {
    updatedSessionId = this.socket.fromEvent<string>('update_sid');

    constructor(
        private http: HttpClient,
        private socket: Socket
    ){}


    // ----- SOCKET-IO CONFIG -----
    // setupSocketConnection() {
    //     this.env.socket = io.connect("localhost:5000")                  // verwenden wenn neuer CLieint sich mit socket-server verbindet (request.sid wert wird generiert)
    //     this.env.socketPrivate = io("localhost:5000/private")
    // }

    // userData als Parameter, da s. this.authService.currentUser.subscribe == circular dependency!!! 

    // TODO: funktioniert das so mit der neuen SOcketIO angular architechture
    createSession() {
        const userData = JSON.parse(localStorage.getItem("userData"))
        const jwt_token_expirationDate = userData._expirationDate
        // if (!this.env.socket || !this.env.socketPrivate) {
        //     throw new Error("wasn't able to connect to socket-server")
        // }
        this.socket.emit("email", userData.email, jwt_token_expirationDate)
    }
    
    

    // TODO: wird noch nicht benötigt
    deleteSession(user_id: string) {
        this.http.delete<string>(
            `http://127.0.0.1:5000/session/${user_id}`
        ).pipe(catchError(this.handleErrors)).subscribe(
            (message: string) => {
                console.log(message)
            }
        )
    }

    // TODO: getSession() http request -> dann in sessionExist() callen
    getSession(user_id: number) {
        return this.http.get<SessionResponseData>(`http://127.0.0.1:5000/session/${user_id.toString()}`
            ).pipe(catchError(this.handleErrors))  
    }
    

    // check if session already exist for the user
    // TODO: in chatSessionGuardService aufrufen

    // TODO: isConnected == false (immer) da returned wird bevor this.getSession()-Observable-Wert gefethced wird
    // stattdessen lieber mit Promise arbeiten? -> return new Promise?



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


    

    

}
