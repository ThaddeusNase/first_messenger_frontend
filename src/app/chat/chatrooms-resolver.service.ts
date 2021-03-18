import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Chatroom } from '../shared/models/chatroom.model';
import { ChatService, RoomResponseData, UserChatroomsResponseData } from './chat.service';

@Injectable({"providedIn": "root"})
export class ChatroomsResolverService implements Resolve<UserChatroomsResponseData> {

    constructor(private chatService: ChatService) {
    }
    
    currentUserData: {
        email: string,
        id: number,
        _token: string,
        _expirationDate: string
      } = JSON.parse(localStorage.getItem("userData"))

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserChatroomsResponseData> | Promise<UserChatroomsResponseData> | UserChatroomsResponseData {
        return this.chatService.getAllChatrooms(this.currentUserData.id)
    }

}