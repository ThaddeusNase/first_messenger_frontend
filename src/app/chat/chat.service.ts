import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Injectable, OnInit } from "@angular/core";
import { throwError } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { isObject } from 'util';
import { AuthService } from '../auth/auth.service';
import { SessionResponseData, SessionService } from '../auth/session.service';
import { MessageModel } from '../shared/message.model';

import { User } from '../shared/user.model';
import { UsersService } from '../shared/users.service';
import { UserResponseData } from '../shared/users.service'



@Injectable({providedIn: "root"})
export class ChatService {

    constructor(
        private sessionService: SessionService, 
        private usersService: UsersService,
        private http: HttpClient
    ){}

    env = environment;

    createNewChatroom() {
        
    }
    
    // TODO: RecipientUser-Object statt recipientEmail 
    sendMessage(msg: MessageModel, recipientEmail: string) {
        console.log(msg);

        // check ob partner/recipinet eine session id besitzt mit email 
        // TODO: fetch by uid, von kontaktlist via "contacts = User[]" (= leeres User array)
        this.usersService.fetchUserByEmail(recipientEmail).pipe(exhaustMap(
            (recipient: UserResponseData) => {
                return this.sessionService.getSession(recipient.uid)
            }
        ), catchError(this.handleErrors)) 
        .subscribe(
            (sessionResData: SessionResponseData) => {
                
                if (sessionResData.sid && !sessionResData.session_expired ) {
                    console.log("--- sid: ", sessionResData.sid);
                    this.sendViaWebSocket(msg)
                } else {
                    console.log("--- sessionData: ", sessionResData);
                    this.sendViaHttp(msg, recipient)
                }

            }

        )
    }

    handleErrors(errorResponse: HttpErrorResponse) {
        return throwError(errorResponse)
    }

    sendViaWebSocket(msg) {
        this.env.socketPrivate.emit("private_message", msg)
    }

    sendViaHttp(msg) {
        return this.http.post<>()
    }

    
    
}