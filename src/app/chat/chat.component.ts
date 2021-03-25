import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Data } from '@angular/router';
import { sample } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { SessionResponseData, SessionService } from '../auth/session.service';
import { UsersService } from '../shared/services/users.service';
import { ChatService, RoomResponseData, UserChatroomsResponseData } from './chat.service';
// import { ChatroomDialogComponent } from './chatroom-dialog/chatroom-dialog.component';
import { ChatroomDialogComponent } from './chatroom-dialog/chatroom-dialog.component';
import { Chatroom } from '../shared/models/chatroom.model';
import { MessageModel } from '../shared/models/message.model';
import { CurrentUser } from '../shared/models/currentuser.model';
import { ChatroomEntryModel } from '../shared/models/chatroomEntry.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  chatroomDialogoOpened = false

  constructor(
      private authService: AuthService, 
      private chatService: ChatService,
      private activatedRoute: ActivatedRoute
  ){ }

  current_user: CurrentUser;
  chatroom_entries: ChatroomEntryModel[] = [];
   
  // TODO: soäter noch mit reactive form kompliziertere message form -> group chats , an mehereren rooms senden etc
  @ViewChild("sendMsgForm", {static: true}) sendMsgForm: NgForm; 

  ngOnInit() {
    this.authService.autologin()
    // this.sessionService.setupSocketConnection()
    this.authService.currentUser.subscribe(
      (user: CurrentUser) => {
        this.current_user = user
      }
    )
    this.observeNewMessageSent()
    this.fetchChatroomsEntries();
  }

  private fetchChatroomsEntries() {
    this.activatedRoute.data.subscribe(
      (data: Data) => {        
        const room_entries: ChatroomEntryModel[] = data["chatroomsEntries"]
        console.log(room_entries);
        this.chatroom_entries = room_entries
        
        this.chatroom_entries = this.chatroom_entries.sort(
          (a: ChatroomEntryModel, b: ChatroomEntryModel) => {
            return b.lastMessage.creationDate.getTime() - a.lastMessage.creationDate.getTime()
          }
        )
      }
    )

  }


  // private fetchUserChatrooms() {
  //   var tmpChatrooms: Chatroom[] = [] 
  //   // MARK: Aufpassen, da hier die Chatrooms nur vom Resolver gefetched werden -> eventuell bugs beim fetchen  der chatrooms
  //   // TODO: eventuell nochmal eine neue methode wo man chatrooms DIREKT von chatService.getAllChatrooms.subscribe fetched´
  //   this.activatedRoute.data.subscribe(
  //     (data: Data) => {
  //       this.chatrooms = []
  //       const chatrooms_data = data["chatroomsEntries"]["chatroom_entries"];

  //       chatrooms_data.forEach((roomData: RoomResponseData) => {
  //         const room = new Chatroom(roomData.id, new Date(roomData.creation_date), roomData.name, roomData.member_limit);
  //         tmpChatrooms.push(room);
  //       });
  //       this.chatrooms = tmpChatrooms
  //     }
  //   );
  // }

  observeNewMessageSent() {
    this.chatService.newMessageSent.subscribe(
      (msg: MessageModel) =>  {
        console.log("executed");
    
        this.chatroom_entries.map(
          (entry: ChatroomEntryModel) => {
            if (entry.room.id === msg.chatroomId) {
              
              entry.lastMessage = msg
            }
          }
        )
        this.chatroom_entries = this.chatroom_entries.sort(
          (a: ChatroomEntryModel, b: ChatroomEntryModel) => {
            return b.lastMessage.creationDate.getTime() - a.lastMessage.creationDate.getTime()
          }
        )
        console.log("---", this.chatroom_entries);
      }
    )
    

    
  }

  onCreateChatroom() {
    this.chatroomDialogoOpened = true
  }

  onCloseChatroomDialog() {
    this.chatroomDialogoOpened = false
  }

  // TODO: s. cascading EventEmitter: nicht Chatroom sondern chatroomEntryModel übergeben
  onSaveChatroom(newChatroomEntry: ChatroomEntryModel ) {
    this.chatroomDialogoOpened = false
    // https://stackoverflow.com/questions/55369253/cdkvirtualfor-not-rendering-new-items
    // s. stackoverflow: chatroom muss mutated werden, damit verändertes == NEUE chatrooms[]- INSTANZ
    // auch von *cdkVirtualFor="let room of chatrooms" übernommen werden kann
    // this.chatroom.push(newChatroom) WÜRDE DAS chatrooms array nicht neu mutaten -> hence keine veränderungen im chatroom-list

    // TODO: new chatroom creation animation (float in von links,  alle  anderen einen nach unten)
    this.chatroom_entries = [newChatroomEntry,...this.chatroom_entries]
  }



}
