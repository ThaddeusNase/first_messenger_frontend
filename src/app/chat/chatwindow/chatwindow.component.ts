import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Data, Params, Router } from '@angular/router';
import { timeStamp } from 'console';
import { VirtualTimeScheduler } from 'rxjs';
import { exhaustMap, map, take } from 'rxjs/operators';
import { Chatroom } from 'src/app/shared/models/chatroom.model';
import { MembershipModel } from 'src/app/shared/models/membership.model';
import { CurrentUser } from 'src/app/shared/models/currentuser.model';
import { UserResponseData, UsersService } from 'src/app/shared/services/users.service';
import { ChatService, ChatWindowHeaderInfoResponseData, MessageData, RoomResponseData } from '../chat.service';
import { MessageModel } from 'src/app/shared/models/message.model';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-chatwindow',
  templateUrl: './chatwindow.component.html',
  styleUrls: ['./chatwindow.component.css']
})
export class ChatwindowComponent implements OnInit {

  @Output() newMessageSent = new EventEmitter<MessageModel>()

  chatroom: Chatroom;
  chatpartner: User;

  messages: MessageModel[] = []
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
    // this.fetchChatroomOrChatpartner()
    this.fetchResolvedData()
  }

  fetchResolvedData() {
    this.activatedRoute.data.subscribe(
      (data: Data) => {
        const roomResData: ChatWindowHeaderInfoResponseData = data["openedChatroomData"]
        const chatroomObj: Chatroom = new Chatroom(roomResData.room.id, new Date(roomResData.room.creation_date), roomResData.room.name, roomResData.room.member_limit)
        if (chatroomObj.member_limit === 2) {
          const partner: User = new User(roomResData.chatpartner.uid.toString(), roomResData.chatpartner.email, roomResData.chatpartner.first_name, roomResData.chatpartner.surname, roomResData.chatpartner.bio)
          this.chatpartner = partner
        }
        // TODO: else chatpartner Array (eventuell nochmal UserChatroomWindowHeaderResource im flask backend überarbeiten )

        const messagesForRoom: MessageModel[] = data["messagesForRoom"]

        this.chatroom = chatroomObj 
        this.messages = messagesForRoom
      } 
    )
  
  }




  // TODO: fetchChatroomOrChatrpartner refactoren oder komplett lösschen
  fetchChatroomOrChatpartner() {
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

  
  onMessageSent(msgData: MessageData) {
    // TODO: handle messageid == null -> optional in MessageData?!
    const newMessage: MessageModel = new MessageModel(msgData.id, msgData.content, msgData.delivery_time, +msgData.room_id, +msgData.author_id)
    // this.newMessageSent.emit(newMessage)
    this.chatService.newMessageSent.next(newMessage)
    this.messages.push(newMessage)
  }

}
