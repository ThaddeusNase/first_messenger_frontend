import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Data } from '@angular/router';
import { sample } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { SessionResponseData, SessionService } from '../auth/session.service';
import { Chatroom } from '../shared/chatroom.model';
import { MessageModel } from '../shared/message.model';
import { User } from '../shared/user.model';
import { UsersService } from '../shared/users.service';
import { ChatService, RoomResponseData, UserChatroomsResponseData } from './chat.service';
// import { ChatroomDialogComponent } from './chatroom-dialog/chatroom-dialog.component';
import { ChatroomDialogComponent } from './chatroom-dialog/chatroom-dialog.component';




@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  createChatroomDialogOpened = false

  constructor(
      private sessionService: SessionService, 
      private authService: AuthService, 
      private chatService: ChatService,
      private usersService: UsersService,
      private activatedRoute: ActivatedRoute
  ){ }

  current_user: User;
  chatrooms: Chatroom[] = [];
   
  // TODO: soäter noch mit reactive form kompliziertere message form -> group chats , an mehereren rooms senden etc
  @ViewChild("sendMsgForm", {static: true}) sendMsgForm: NgForm; 

  ngOnInit() {
    this.authService.autologin()
    this.sessionService.setupSocketConnection()
    this.fetchUserChatrooms();

    this.authService.currentUser.subscribe(
      (user: User) => {
        this.current_user = user
      }
    )

  }


  private fetchUserChatrooms() {
    var tmpChatrooms: Chatroom[] = [] 
    // MARK: Aufpassen, da hier die Chatrooms nur vom Resolver gefetched werden -> eventuell bugs beim fetchen  der chatrooms
    // TODO: eventuell nochmal eine neue methode wo man chatrooms DIREKT von chatService.getAllChatrooms.subscribe fetched´
    this.activatedRoute.data.subscribe(
      (data: Data) => {
        this.chatrooms = []
        const chatrooms_data = data["chatrooms"]["all_user_chatrooms"];

        chatrooms_data.forEach((roomData: RoomResponseData) => {
          const room = new Chatroom(roomData.id, new Date(roomData.creation_date), roomData.name, roomData.member_limit);
          tmpChatrooms.push(room);
        });
        this.chatrooms = tmpChatrooms
      }
    );
  }

  onCreateChatroom() {
    this.createChatroomDialogOpened = true
  }

  onCloseCreateChatroomDialog() {
    this.createChatroomDialogOpened = false
  }

  onSaveChatroom(newChatroom: Chatroom) {
    console.log("new Chatroom: ", newChatroom);
    this.createChatroomDialogOpened = false
    // https://stackoverflow.com/questions/55369253/cdkvirtualfor-not-rendering-new-items
    // s. stackoverflow: chatroom muss mutated werden, damit verändertes == NEUE chatrooms[]- INSTANZ
    // auch von *cdkVirtualFor="let room of chatrooms" übernommen werden kann
    // this.chatroom.push(newChatroom) WÜRDE DAS chatrooms array nicht neu mutaten -> hence keine veränderungen im chatroom-list

    // TODO: new chatroom creation animation (float in von links,  alle  anderen einen nach unten)
    this.chatrooms = [newChatroom,...this.chatrooms]
  }



}
