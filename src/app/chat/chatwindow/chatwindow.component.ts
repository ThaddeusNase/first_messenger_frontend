import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Params, Router } from '@angular/router';
import { timeStamp } from 'console';
import { VirtualTimeScheduler } from 'rxjs';
import { exhaustMap, map, take } from 'rxjs/operators';
import { Chatroom } from 'src/app/shared/chatroom.model';
import { MembershipModel } from 'src/app/shared/membership.model';
import { User } from 'src/app/shared/user.model';
import { UserResponseData, UsersService } from 'src/app/shared/users.service';
import { ChatService, RoomResponseData } from '../chat.service';

@Component({
  selector: 'app-chatwindow',
  templateUrl: './chatwindow.component.html',
  styleUrls: ['./chatwindow.component.css']
})
export class ChatwindowComponent implements OnInit {

  chatroom: Chatroom;
  chatpartner: UserResponseData;

  memberhsips: MembershipModel[] = []


  // TODO: in chatservice -> determin if a chatroom has more then 2 members (then its a group) 
  // otherwise chatpartner = einen Wert geben  

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private chatService: ChatService,
    private userService: UsersService
  ) {}


  ngOnInit() {
    this.fetchChatroomOrChatrpartner()
  }

  fetchChatroomOrChatrpartner() {
    this.activatedRoute.data.subscribe(
      (data: Data) => {
        var resolvedData = data["openedChatroomData"]
        // wenn resolvedData das Property .member_limit besitzt: dann ist resolvedData == UserResponseData
        // (d.h. chatgroup hat > 2 member)
        if (resolvedData.member_limit !== undefined) {
          this.chatpartner = null;
          this.chatroom = resolvedData // -> unnötig: da chatroom bereits via @Input() von chatroom-list.componment übergeben wird           
        } else {
          // wenn resolvedData KEIN .member_limit property besitzt: dann ist resolvedData == UserResponseData
          this.chatroom = null
          this.chatpartner = resolvedData
        }
      }
    )
  }

  // TODO: eventuell in Resolver nach url-subscriben und entsprechenden Chatroom fetchen (via Http request)



  
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
