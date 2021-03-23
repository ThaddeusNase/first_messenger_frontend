import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Chatroom } from 'src/app/shared/models/chatroom.model';
import { ChatroomEntryModel } from 'src/app/shared/models/chatroomEntry.model';
import { MessageModel } from 'src/app/shared/models/message.model';
import { User } from 'src/app/shared/models/user.model';
import { ChatService, MessageData } from '../../chat.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush 
})
export class ChatroomComponent implements OnInit, OnChanges {

  constructor(
    private chatService: ChatService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  @Input() chatroom_entry: ChatroomEntryModel
  @Input() chatpartner: User
  lastMessage: MessageModel
  newMessagesAmount: number = 0

  ngOnInit() {
    // console.log("---chatroom-entry: ", this.chatroom_entry);
    
    // TODO: via chat.service fetchen (mitHilfe der jeweiligen Chatroom id)
    this.lastMessage = new MessageModel(1, "ey jo was geht bei dir brooo", new Date(), 1, 1)
    this.chatService.observeNewMessageForRoom(this.chatroom_entry.room.id).subscribe(
      (msgData: MessageData) => {
        const newFetchedMessage = new MessageModel(msgData.id, msgData.content, msgData.delivery_time, +msgData.room_id, +msgData.author_id)
        this.chatService.newMessageSent.next(newFetchedMessage)
        // TODO: lastMessage handeling
        //  on click event & iwie wenn user auf chatroom-route klickt, dann auch newMessagesAmount = 0:
        // messageSend vom footer ->  lastMessage mit eigener message die man gesendet hat überschreiben
        // newMessagesAmount = 0 
        // this.lastMessage = newFetchedMessage

        if (!this.router.url.includes(`${this.chatroom_entry.room.id}`)) {
          this.newMessagesAmount += 1
        }
      }
    )

  
  }


  ngOnChanges(changes: SimpleChanges) {
  }

  onResetNewMessagesAmount() {
    this.newMessagesAmount = 0
  }

}
