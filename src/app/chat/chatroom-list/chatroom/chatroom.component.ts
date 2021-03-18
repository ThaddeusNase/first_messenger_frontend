import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Chatroom } from 'src/app/shared/models/chatroom.model';
import { MessageModel } from 'src/app/shared/models/message.model';
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

  @Input() chatroom: Chatroom
  lastMessage: MessageModel
  newMessagesAmount: number = 0

  ngOnInit() {
    // TODO: via chat.service fetchen (mitHilfe der jeweiligen Chatroom id)
    this.lastMessage = new MessageModel(1, "ey jo was geht bei dir brooo", new Date(), 1, 1)
    this.chatService.observeNewMessageForRoom(this.chatroom.id).subscribe(
      (msgData: MessageData) => {
        const newFetchedMessage = new MessageModel(msgData.id, msgData.content, msgData.delivery_time, +msgData.room_id, +msgData.author_id)
        
        // TODO: lastMessage handeling
        //  on click event & iwie wenn user auf chatroom-route klickt, dann auch newMessagesAmount = 0:
        // messageSend vom footer ->  lastMessage mit eigener message die man gesendet hat überschreiben
        // newMessagesAmount = 0 
        // this.lastMessage = newFetchedMessage

        if (!this.router.url.includes(`${this.chatroom.id}`)) {
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
