import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Data } from '@angular/router';
import { sample } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { SessionResponseData, SessionService } from '../auth/session.service';
import { UsersService } from '../shared/services/users.service';
import { ChatService, MessageData, RoomResponseData, UserChatroomsResponseData } from './chat.service';
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
    this.observeNewMessageReceived()
    this.fetchChatroomsEntries();
  }

  private fetchChatroomsEntries() {
    this.activatedRoute.data.subscribe(
      (data: Data) => {        
        const room_entries: ChatroomEntryModel[] = data["chatroomsEntries"]
        this.chatroom_entries = room_entries
        
        this.chatroom_entries = this.chatroom_entries.sort(
          (a: ChatroomEntryModel, b: ChatroomEntryModel) => {
            return b.lastMessage.creationDate.getTime() - a.lastMessage.creationDate.getTime()
          }
        )
      }
    )
  }

  private observeNewMessageReceived() {
    this.chatService.observeMessage().subscribe(
      (msgData: MessageData) => {
        const msg: MessageModel = new MessageModel(msgData.id, msgData.content, new Date(), +msgData.room_id, +msgData.author_id)
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
      }
    )
  }

  // this.chatService.observeMessage().subscribe(
  //   (msgData: MessageData) => {
  //     this.chatroom_entries = this.chatroom_entries.sort(
  //       (a: ChatroomEntryModel, b: ChatroomEntryModel) => {
  //         return b.lastMessage.creationDate.getTime() - a.lastMessage.creationDate.getTime()
  //       }
  //     )

  //   }
  //   // frage ist, ob die neue message überhaupt in lastmessage übernommen wurde und somit auch danach gesorted werden kann
  //   console.log("chatroom_entries after observeMessage executed: ", this.chatroom_entries)
  // )

  observeNewMessageSent() {
    this.chatService.newMessageSent.subscribe(
      (msg: MessageModel) =>  {
    
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
