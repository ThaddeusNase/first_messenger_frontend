import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from "@angular/core";
import { pipe, Subject, throwError } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { MembershipModel } from '../shared/models/membership.model';
import { Socket } from 'ngx-socket-io';
import { MessageModel } from '../shared/models/message.model';
import { User } from '../shared/models/user.model';
import { UserResponseData } from '../shared/services/users.service';
import { Chatroom } from '../shared/models/chatroom.model';


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
    join_date: string
}

export interface MembershipsResponseData {
    memberships: MembershipModel[]
}

export interface UserChatroomsResponseData {
    all_user_chatrooms: RoomResponseData[]
}

export interface UserChatpartnersResponseData {
    all_user_chat_partners: UserResponseData[]
}

export interface MessageData {
    author_id: string;
    delivery_time: Date; 
    content: string
    room_id: string
    id?: number;            // optional, da bei der erstellung (via socketio) auf client side noch keine id initialisiert wird (erst bei response)
}

export interface MessagesForRoomResponseData {
    room_messages: MessageData[]
}

export interface CommonChatpartnerMembershipsResponseData {
    common_memberships: MembershipResponseData[]
}

export interface UserChatroomEntryResData {
    room: RoomResponseData,
    lastMessage: MessageData,
    chatpartner: UserResponseData | null
}

export interface UserChatroomEntriesResponseData {
    chatroom_entries: UserChatroomEntryResData[]
}

export interface ChatWindowHeaderInfoResponseData {
    room: RoomResponseData,
    chatpartner: UserResponseData
}






@Injectable({ providedIn: "root" })
export class ChatService {

    // TODO: statt newChatroomCreated => newChatroomEntryCreated = new Subject<ChatroomEntryModel>
    newChatroomCreated = new Subject<Chatroom>()
    newMessageSent = new Subject<MessageModel>()

    constructor(
        private http: HttpClient,
        private socket: Socket
    ) { 
        // this.connect = new SocketNameSpace({url: 'http://localhost:5000',options: {} })
        // this.private = new SocketNameSpace({url: 'http://localhost:5000/private', options: {}})
    }

    // env = environment;




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

    getAllChatpartners(userId: number) {
        return this.http.get<UserChatpartnersResponseData>("http://127.0.0.1:5000/user_chatpartners/" + userId).pipe(
            map(
                (resData: UserChatpartnersResponseData) => {
                    let chatPartners: User[] = []
                    resData["all_user_chat_partners"].forEach(
                        (userResData: UserResponseData) => {
                            const chatPartner: User = new User(
                                userResData.uid.toString(),
                                userResData.email, 
                                userResData.first_name, 
                                userResData.surname, 
                                userResData.bio
                            )
                            chatPartners.push(chatPartner)
                        }
                    )
                    return chatPartners
                }
            ),
            catchError(this.handleErrors)
        )
    }

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


    fetchCommonMembershipsOfUserAndChatPartner(current_uid: number, chatparnter_uid: number) {
        return this.http.get<CommonChatpartnerMembershipsResponseData>("http://127.0.0.1:5000/common_user_chatpartner_memberships/" + current_uid + "/" + chatparnter_uid).pipe(
            map(
                (resData :CommonChatpartnerMembershipsResponseData) => {
                    return resData["common_memberships"]
                }
            ),
            catchError(this.handleErrors)
        )
    }


    getUserChatroomEntries(current_uid: number) {
        return this.http.get<UserChatroomEntriesResponseData>("http://127.0.0.1:5000/user_chatroom_list_entries/" + current_uid).pipe(
            catchError(this.handleErrors)
        )
    }


    // TODO: RecipientUser-Object statt recipientEmail 
    sendMessage(msg: MessageData) {
        console.log("sendMessage() EXECUTED");
        this.socket.emit("private_message", msg)
    }

    observeMessage() {
        return this.socket.fromEvent("received_private_message")
    }

    observeNewMessageForRoom(room_id: number) {
        return this.socket.fromEvent(`received_private_message_room_${room_id}`)
    }


    fetchMessagesForRoom(id: number) {
        return this.http.get<MessagesForRoomResponseData>("http://127.0.0.1:5000/messages_for_room/" + id).pipe(
            map((messagesResData:MessagesForRoomResponseData) => {
                const messagesData: MessageData[] = messagesResData["room_messages"]
                let convertedData: MessageModel[] = messagesData.map((msgData: MessageData) => {
                    return new MessageModel(msgData.id, msgData.content, msgData.delivery_time, +msgData.room_id, +msgData.author_id)
                })
                return convertedData
            }),
            catchError(this.handleErrors)
        )
    }


    fetchChatWindowHeaderInformation(current_uid:number , room_id:number) {
        return this.http.get<ChatWindowHeaderInfoResponseData>(`http://127.0.0.1:5000/user_chatroom_window_header/${current_uid}/for_room/${room_id}`).pipe(
            catchError(this.handleErrors)
        )
    }



    handleErrors(errorResponse: HttpErrorResponse) {

        var errorMsg = "unknown error occoured"
        if (!errorResponse.error || !errorResponse.error.message) {
            // console.error("---", errorResponse)
            return throwError(errorResponse.error.message)
        }
        switch (errorResponse.error.message) {
            case "USER_DOES_NOT_EXIST":
                errorMsg = "the user doesn't exist"
                break;
            case "USER_ALREADY_MEMBER":
                errorMsg = "user is already of this Group"
                break;
            case "UNKNOWN_SERVER_ERROR":
                errorMsg = "unknown server error occured"
                break;
            case "ROOM_DOES_NOT_EXIST":
                errorMsg = "chatroom does not exist"
                break;
            case "ROOM_ID_NOT_PROVIDED":
                errorMsg="chatroom_id was not provided"
                break;
            case "NO_COMMON_MEMBERSHIPS_FOUND":
                errorMsg = "currentUser and chatpartner don't have any common chatrooms"
            case "ROOM_MEMBERLIMIT_IS_NOT_TWO":
                errorMsg = "room memberlimit != 2 -> room is probably a group_chat(?)"
        }
        return throwError(errorMsg)
    }

    // sendViaHttp(msg) {
    //     return this.http.post<>()
    // }



}