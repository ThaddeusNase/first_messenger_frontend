import { NgSwitchCase } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { error } from 'console';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/user.model';



export interface UserResponseData {
    first_name: string,
    surname: string,
    email: string, 
    uid: number,
    bio: string,
    sid?: string,
}

export interface FilteredUsersResponseData {
    filtered_users: UserResponseData[] 
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

    updateUser(user: User) {
        console.log("---user: ", user);
        
        // TODO: refactor put request: nur uid in headers, den rest in body!!!
        return this.http.put<UserResponseData>("http://127.0.0.1:5000/user", {} ,{
            headers: new HttpHeaders(
                // header values dürfen nicht none (undefined oder Null sein) -> deshalb leerer string ""
                {
                    "uid": user.id || "",
                    "email": user.email || "",
                    "firstname": user.firstname || "",
                    "surname": user.surname || "",
                    "bio": user.bio || ""
                })
        }).pipe(catchError(this.handleErrors))
    }


    fetchFilteredUsers(searchTerm: string) {

        // TODO: if searchTerm == "" || null: 
        // -> dann top 10 von contacte fetchen (mit denen man nochn keinen Chatroom hat)
        return this.http.get<FilteredUsersResponseData>("http://127.0.0.1:5000/filter_users",
            {
                params: new HttpParams().set("searchterm", searchTerm)
            }
        ).pipe(catchError(this.handleErrors))
    }


    handleErrors(errorResponse: HttpErrorResponse) {
        let errorMessage = "unknown error occured in UsersService (not in responseError)"
        console.error(errorResponse)
        
        if (!errorResponse.error || !errorResponse.error.message) {
            return throwError(errorMessage)
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
            case "USER_UPDATE_REQUIRES_UID":
                errorMessage = "user-id is required to update changes"
            default:
                errorMessage = "unknown error occured in UsersService (thrown by default!)"
                console.error(errorResponse);
                break;
        }

        return throwError(errorMessage)
    }




}