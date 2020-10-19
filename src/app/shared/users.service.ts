import { NgSwitchCase } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from './user.model';



export interface UserResponseData {
    email: string, 
    uid: number,
    sid: string
}


@Injectable({providedIn: "root"})
export class UsersService {
    constructor(private http: HttpClient) {}

    // TODO: getAllContacts
    // -> neue Resource im flask backend hinzufügen (die sich um alle users/contacts kümmert)
    

    // --- fetch specific user ---
    fetchUserByEmail(email: string) {
        return this.http.get<UserResponseData>(
            "http://127.0.0.1:5000/user", 
            {
                headers: new HttpHeaders({"email": email})
            }
        )
    }


    fetchUserByUid(uid: string) {
        return this.http.get<UserResponseData>(
            "http://127.0.0.1:5000/user", 
            {
                headers: new HttpHeaders({"uid": uid})
            }
        ).pipe(catchError(this.handleErrors))
    }

    fetchUserBySid(sid: string) {
        return this.http.get<UserResponseData>(
            "http://127.0.0.1:5000/user",
            {
                headers: new HttpHeaders({"sid": sid})
            }
        ).pipe(catchError(this.handleErrors))
    }

    


    handleErrors(errorResponse: HttpErrorResponse) {
        let errorMessage = "unknown error occured in UsersService (not in responseError)"
        
        if (!errorResponse.error || !errorResponse.error.message) {
            return errorMessage
        }

        switch (errorResponse.error.message) {
            case "INVALID_HEADERS_KEY":
                errorMessage = "invalid headers key please check the if 'email','sid' or 'uid' is provided by fetching a user"
                break;
            case "USER_HAS_NO_VALID_SESSION":
                errorMessage = "user is not logged in/has no valid session(id)"
                break; 
            case "USER_DOES_NOT_EXIST":
                errorMessage = "user does not exist"
                break;
            default:
                errorMessage = "unknown error occured in UsersService (thrown by default!)"
                break;
        }

        return throwError(errorMessage)

    }




}