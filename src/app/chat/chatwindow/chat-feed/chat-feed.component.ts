import { Component, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Chatroom } from 'src/app/shared/models/chatroom.model';
import { CurrentUser } from 'src/app/shared/models/currentuser.model';
import { MessageModel } from 'src/app/shared/models/message.model';
import { ChatService, MessageData } from '../../chat.service';

@Component({
  selector: 'app-chat-feed',
  templateUrl: './chat-feed.component.html',
  styleUrls: ['./chat-feed.component.css']
})
export class ChatFeedComponent implements OnInit, OnChanges {

  @Input() chatroom: Chatroom;
  @Input() messages: MessageModel[]

  currentUser: CurrentUser

  observeMessageSubscription: Subscription

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(
      (currUser: CurrentUser) => {
        this.currentUser = currUser
      }
    )

    this.observeMessageSubscription = this.chatService.observeNewMessageForRoom(this.chatroom.id).subscribe(
      (msgData : MessageData) => {
        console.log("received new msgData: ",msgData);
        // check ob es überhaupt der richtige chatroom ist, wo wie die nachricht appenden
        if (this.chatroom.id === +msgData.room_id) {
          const newMsg = new MessageModel(msgData.id, msgData.content, msgData.delivery_time, +msgData.room_id, +msgData.author_id)
          this.messages.push(newMsg)
        }
      }
    )
  }

  ngOnChanges(changes: SimpleChanges) {
    // WICHTIG: fetchMessagesForRoom muss in ngOnChanges aufgerufen werden und nicht in ngOnInit!!!
    // (sonst würde nur bei Initialisierung 1x einziges mal messages für EINEN chatroom gefetched werden
    // aber nicht, wenn user in chatroomlist einen anderen chatroom anklickt!)
    // this.observeMessageSubscription = this.chatService.observeNewMessageForRoom(this.chatroom.id).subscribe(
    //   (msgData : MessageData) => {
    //     console.log("received new msgData: ",msgData);
    //     // check ob es überhaupt der richtige chatroom ist, wo wie die nachricht appenden
    //     if (this.chatroom.id === +msgData.room_id) {
    //       const newMsg = new MessageModel(msgData.id, msgData.content, msgData.delivery_time, +msgData.room_id, +msgData.author_id)
    //       this.messages.push(newMsg)
    //     }
    //   }
    // )
    // this.observeMessageSubscription.unsubscribe()
  }

}
