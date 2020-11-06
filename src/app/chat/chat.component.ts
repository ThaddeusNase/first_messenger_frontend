import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { sample } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { SessionResponseData, SessionService } from '../auth/session.service';
import { Chatroom } from '../shared/chatroom.model';
import { MessageModel } from '../shared/message.model';
import { User } from '../shared/user.model';
import { UsersService } from '../shared/users.service';
import { ChatService } from './chat.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(
      private sessionService: SessionService, 
      private authService: AuthService, 
      private chatService: ChatService,
      private usersService: UsersService
  ){ }

  current_user: User;
   

  // TODO: soäter noch mit reactive form kompliziertere message form -> group chats , an mehereren rooms senden etc
  @ViewChild("sendMsgForm", {static: true}) sendMsgForm: NgForm; 

  ngOnInit() {

    

    // TODO: (auch in flask-backend implmentieren -> alle chatrooms fetchen in dem sich der currentuser befindet
    // this.chatrooms = this.chatService.getAllChatsFor(this.current_user.id)

    this.authService.autologin()
    this.sessionService.setupSocketConnection()

    console.log(this.sendMsgForm);
    this.authService.currentUser.subscribe(
      (user: User) => {
        this.current_user = user
      }
    )
  }


  onCreateNewChatroom() {
    // TODO: chatservice function call
      
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
