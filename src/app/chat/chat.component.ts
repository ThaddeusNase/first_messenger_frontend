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
          console.log(roomData);
          
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
    this.createChatroomDialogOpened = false
    this.chatrooms.push(newChatroom)
  }

  onSubmit() {

    // const recipientEmail = this.sendMsgForm.form.controls.email.value
    // const currentUid = +this.current_user.id
    // const deliveryDate = new Date()
    // const msgContent = this.sendMsgForm.form.controls.msg.value

    // const newMessage = new MessageModel(recipientEmail, currentUid, deliveryDate, msgContent)
    // console.log("---", newMessage);

    // // this.usersService.fetchUserByEmail(recipientEmail).subscribe(
    // //   (userResData)

    // // )
    // if (this.sendMsgForm.valid) {
    //   // TODO: fetch by uid, von kontaktlist via "contacts = User[]" (= leeres User array)
    //   // this.chatService.sendMessage(newMessage, User(...))

    //   this.chatService.sendMessage(newMessage, newMessage.recipient_email)

      // this.sessionService.getSession(32).subscribe(
      //   (resData: SessionResponseData) => {

      //     console.log(resData);
          
      //   }
      // )
        
    // }
  }

  


  




}
