import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable,  } from 'rxjs';
import { map } from 'rxjs/operators';
import { Chatroom } from '../shared/models/chatroom.model';
import { ChatroomEntryModel } from '../shared/models/chatroomEntry.model';
import { MessageModel } from '../shared/models/message.model';
import { User } from '../shared/models/user.model';
import { ChatService, UserChatroomEntriesResponseData, UserChatroomEntryResData } from './chat.service';

@Injectable({ providedIn: 'root' })
export class ChatroomsEntriesResolver implements Resolve<ChatroomEntryModel[] > {

    constructor(private chatService: ChatService) {
    }

    resolve(route: ActivatedRouteSnapshot): Observable<ChatroomEntryModel[]> | Promise<ChatroomEntryModel[]> | ChatroomEntryModel[] {
        const currentUserData: {
            email: string,
            id: number,
            _token: string,
            _expirationDate: string
          } = JSON.parse(localStorage.getItem("userData"))

        return this.chatService.getUserChatroomEntries(currentUserData.id).pipe(
            map(
                (entriesResData: UserChatroomEntriesResponseData) => {
                    // console.log("---chatroomsEntries-resolver.ts, entriesResData: ",entriesResData);
                    
                    return entriesResData["chatroom_entries"].map(
                        (entryResData: UserChatroomEntryResData) => {
                            // console.log("---chatroomsEntries-resolver.ts, convertedData: ",this.getConvertedEntryModel(entryResData));
                            return this.getConvertedEntryModel(entryResData)
                        }
                    )
                }
            )
        );
    }



    getConvertedEntryModel(entryResData: UserChatroomEntryResData): ChatroomEntryModel {

        let chatpartner: User = null;

        const chatroom: Chatroom = new Chatroom(
            entryResData.room.id,
            new Date(entryResData.room.creation_date),
            entryResData.room.name,
            entryResData.room.member_limit
        ) 

        const lastMessage: MessageModel = new MessageModel(
            entryResData.lastMessage.id,
            entryResData.lastMessage.content,
            new Date(entryResData.lastMessage.delivery_time),
            +entryResData.lastMessage.room_id,
            +entryResData.lastMessage.author_id
        )

        if (entryResData.chatpartner !== null) {
            console.log("chatparnter is not null");
            
            const tmpChatpartner: User = new User(
                entryResData.chatpartner.uid.toString(),
                entryResData.chatpartner.email,
                entryResData.chatpartner.first_name,
                entryResData.chatpartner.surname,
                entryResData.chatpartner.bio
            )
            chatpartner = tmpChatpartner
        }
        
        const chatroomEntry: ChatroomEntryModel = new ChatroomEntryModel(
            chatroom,
            lastMessage,
            chatpartner
        )
        return chatroomEntry
    }
}