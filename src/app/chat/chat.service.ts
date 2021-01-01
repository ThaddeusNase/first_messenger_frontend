import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Injectable, OnInit } from "@angular/core";
import { pipe, Subject, throwError } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { isObject } from 'util';
import { AuthService } from '../auth/auth.service';
import { SessionResponseData, SessionService } from '../auth/session.service';
import { Chatroom } from '../shared/chatroom.model';
import { MembershipModel } from '../shared/membership.model';
import { MessageModel } from '../shared/message.model';

import { User } from '../shared/user.model';
import { UsersService } from '../shared/users.service';
import { UserResponseData } from '../shared/users.service'

// TODO: interfaces in einer extra Datei innerhalb des chat-directory 
export interface RoomResponseData {
    name: string,
    id: number,
    creation_date: string,
    member_limit: number
}

export interface MembershipResponseData {
    id: number,
    user_id: number,
    chatroom_id: number,
    joinm_date: string
}

export interface MembershipsResponseData {
    memberships: MembershipModel[]
}

export interface UserChatroomsResponseData {
    all_user_chatrooms: RoomResponseData[]
}


@Injectable({ providedIn: "root" })
export class ChatService {

    constructor(
        private sessionService: SessionService,
        private usersService: UsersService,
        private http: HttpClient
    ) { }

    env = environment;

    // TODO: danach join chatroom methode (http post request an membership Resource): mit admin == current user
    // und hinzugefügte user/kontakte0  
    createNewChatroom(name: string, member_limit?: number) {
        return this.http.post<RoomResponseData>("http://127.0.0.1:5000/chatroom",
            {
                name: name,
                member_limit: member_limit ? member_limit : null
            }
        ).pipe(catchError(this.handleErrors))
    }


    // TODO: 
    getChatroomById(room_id: string) {
        return this.http.get<RoomResponseData>("http://127.0.0.1:5000/chatroom", 
        {
            // WICHTIG: HttpHeaders({key, "VALUE"}) -> value MUSS EIN STRING SEIN(darf kein int etc sein)
            headers: new HttpHeaders({ 'id': room_id})
        }
        ).pipe(catchError(this.handleErrors))

    }

    deleteChatroom(room_id: string) {
        return this.http.delete("http://127.0.0.1:5000/chatroom", {
            // WICHTIG: HttpHeaders({key, "VALUE"}) -> value MUSS EIN STRING SEIN(darf kein int etc sein)
            headers: new HttpHeaders({ 'id': room_id })
        }).pipe(catchError(this.handleErrors))
    }



    joinChatroom(userId: number, chatroomId: number) {
        return this.http.post<MembershipResponseData>("http://127.0.0.1:5000/membership",
            {
                user_id: userId,
                chatroom_id: chatroomId
            }
        ).pipe(catchError(this.handleErrors))
    }



    getAllChatrooms(userId: number) {
        return this.http.get<UserChatroomsResponseData>("http://127.0.0.1:5000/user_chatrooms/" + userId).pipe(
            catchError(this.handleErrors)
        )
    }


    getAllMembershipsForRoomId(room_id: number) {
        // returned MembershipMODEL[] array!!! kein MembershipResponseData[] array!!!
        return this.http.get<MembershipsResponseData>("http://127.0.0.1:5000/memberships_for_room/" + room_id).pipe(
            map(
                (resData: MembershipsResponseData) => {

                    var allMemberships: MembershipModel[] = [];

                    resData.memberships.forEach(membershipData => {
                        const membershipObj = new MembershipModel(
                            membershipData.id,
                            new Date(membershipData.join_date),
                            membershipData.user_id,
                            membershipData.chatroom_id
                        )
                        allMemberships.push(membershipObj)
                    })
                    return {"memberships": allMemberships}
                }
            ),
            catchError(this.handleErrors)
        )
    }


    // TODO: RecipientUser-Object statt recipientEmail 
    sendMessage(msg: MessageModel, recipientEmail: string) {
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

                    if (sessionResData.sid && !sessionResData.session_expired) {
                        console.log("--- sid: ", sessionResData.sid);
                        this.sendViaWebSocket(msg)
                    } else {
                        console.log("--- sessionData: ", sessionResData);
                        // this.sendViaHttp(msg, recipient)
                    }
                }
            )
    }



    sendViaWebSocket(msg) {
        this.env.socketPrivate.emit("private_message", msg)
    }



    handleErrors(errorResponse: HttpErrorResponse) {

        var errorMsg = "unknown error occoured"
        if (!errorResponse.message || !errorResponse.error.message) {
            return throwError(errorMsg)
        }

        switch (errorResponse.error.message) {
            case "USER_DOES_NOT_EXIST":
                errorMsg = "the joining user doesn't exist"
                break;
            case "USER_ALREADY_MEMBER":
                errorMsg = "user is already of this Group"
                break;
            case "UNKNOWN_SERVER_ERROR":
                errorMsg = "unknown server error occured"
                break;
            case "ROOM_DOES_NOT_EXIST":
                errorMsg = "chatroom does not exist"
        }
        return throwError(errorMsg)
    }

    // sendViaHttp(msg) {
    //     return this.http.post<>()
    // }



}