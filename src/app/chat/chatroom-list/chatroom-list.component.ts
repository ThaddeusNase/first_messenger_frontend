import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Chatroom } from 'src/app/shared/models/chatroom.model';
import { ChatroomEntryModel } from 'src/app/shared/models/chatroomEntry.model';
import { MessageModel } from 'src/app/shared/models/message.model';
import { User } from 'src/app/shared/models/user.model';
import { UserResponseData, UsersService } from 'src/app/shared/services/users.service';
import { ChatService, MessageData, RoomResponseData } from '../chat.service';

@Component({
  selector: 'app-chatroom-list',
  templateUrl: './chatroom-list.component.html',
  styleUrls: ['./chatroom-list.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush 
})
export class ChatroomListComponent implements OnInit {
  
  // chatroomsExist: boolean = false;
  @Input() chatroom_entries: ChatroomEntryModel[] = [];
  @Input() chatpartners: User[] = [];

  newMessages: MessageModel[] = []
  
  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private chatService: ChatService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    // TODO: mit observable erstetzen und besseres handeleing -> message jeweiligem chatroom/chatfeed zuordnen etc
    // TODO: MACHT ES NICHT MEHR SINN DIESE METHODE DANN AUCH IN DER CHAT.COMPONENT.TS ZU IMPLEMENTIEREN?!
    this.chatService.observeMessage().subscribe(
      (msgData: MessageData) => {
        const newMessage: MessageModel = new MessageModel(msgData.id, msgData.content, msgData.delivery_time, +msgData.room_id, +msgData.author_id)
        // TODO: eventuell bug, dass chatroom mehrmals in this.chatrooms existiert?!?!
        if (!this.chatroom_entries.find((roomEntry:ChatroomEntryModel) => roomEntry.room.id === newMessage.chatroomId)) {

          // TODO: via http request gefetchten chatroom in chatroom_entries integrieren?!
          this.chatService.getChatroomById(newMessage.chatroomId.toString()).subscribe(
            (roomResData: RoomResponseData) => {

              // TODO: statt newRoom -> newRoomEntry -> zusätzlich new Message dranghängen -> sowohl als Chatpartner
              // chatpartner muss eventuell nochmal via http request gefetched werden um ihn dann in  ein  neues ChatroomEntryModel einzufügen
              const newChatroom = new Chatroom(roomResData.id, new Date(roomResData.creation_date), roomResData.name, roomResData.member_limit)
              const newRoomEntry: ChatroomEntryModel = this.getNewRoomEntry(newChatroom, newMessage)

              this.chatroom_entries.splice(0, 0, newRoomEntry)
              // this.chatService.newChatroomCreated.next(newRoomEntry)
            }
          )
        } else {
          console.log("observeMessage  executed!!! TODO: nochaml anschauen!!!!");
          

          
          // * WENN CHATROOM BEREITS EXISTIERT -> chatroom_entries ORDER BY lastMessage.creation _date* 


        }
      }
    )
  }

  getNewRoomEntry(room: Chatroom, lastMessage: MessageModel): ChatroomEntryModel {
    let newRoomEntry: ChatroomEntryModel = {
      room,
      lastMessage
    }
    // TODO: chatpartner wird eventuell nicht hinzugefügt, da newRoomEntry schneller ist all fetchUserByUid-Observable!
    // wir können hier den chatpartner auch via lastMessage.authorUid fetchen, da chatService.observeMessage() 
    // ja nur eine MsgData payload zurückgibt, wenn sie von einem anderen als currentuid stammt 
    if (room.member_limit == 2) {
      this.usersService.fetchUserByUid(lastMessage.authorUid.toString()).subscribe(
        (userResData: UserResponseData) => {
          const tmpChatpartner: User = new User(
            userResData.uid.toString(),
            userResData.email,
            userResData.first_name,
            userResData.surname,
            userResData.bio
          )
          newRoomEntry["chatpartner"] = tmpChatpartner
        }
      )
    } 
    return newRoomEntry

  }
}
