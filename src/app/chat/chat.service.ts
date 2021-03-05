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
import { Chatroom } from '../shared/models/chatroom.model';
import { MembershipModel } from '../shared/models/membership.model';
import { MessageModel } from '../shared/models/message.model';
import { webSocket } from "rxjs/webSocket";

import { CurrentUser } from '../shared/models/currentuser.model';
import { UsersService } from '../shared/services/users.service';
import { UserResponseData } from '../shared/services/users.service'
import { User } from '../shared/models/user.model';

// TODO: interfaces in einer extra Datei innerhalb des chat-directory 
// TODO:Eventuell Websocket Architecture nochmal überarbeiten s.:
// https://javascript-conference.com/blog/real-time-in-angular-a-journey-into-websocket-and-rxjs/
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

export interface MessageData {
    author_id: string;
    delivery_time: Date; 
    content: string
    room_id: string
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


    // ----- STATTDESSEN s. joinMembersToChatroom() -------
    // joinChatroom(userId: number, chatroomId: number) {
    //     console.log("joinChatroom executed!");
        
    //     return this.http.post<MembershipResponseData>("http://127.0.0.1:5000/membership",
    //         {
    //             user_id: userId,
    //             chatroom_id: chatroomId
    //         }
    //     ).pipe(catchError(this.handleErrors))
    // }



    getAllChatrooms(userId: number) {
        return this.http.get<UserChatroomsResponseData>("http://127.0.0.1:5000/user_chatrooms/" + userId).pipe(
            catchError(this.handleErrors)
        )
    }

    joinMembersToChatroom(members_id_list: number[], room_id:number) {
        return this.http.post<MembershipsResponseData>("http://127.0.0.1:5000/memberships_for_room/" + room_id,
            {
                members_ids: members_id_list
            }
        ).pipe(
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
    sendMessage(msg: MessageData) {
        this.env.socketPrivate.emit("private_message", msg)
    }


    observeMessages() {
        this.env.socketPrivate.on("received_private_message", (msg: MessageData) => {
            console.log("received_private_message: ", msg);    
        })
    }





    handleErrors(errorResponse: HttpErrorResponse) {

        var errorMsg = "unknown error occoured"
        if (!errorResponse.error || !errorResponse.error.message) {
            // console.error("---", errorResponse)
            return throwError(errorResponse.error.message)
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