import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { Chatroom } from 'src/app/shared/models/chatroom.model';
import { MessageModel } from 'src/app/shared/models/message.model';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush 
})
export class ChatroomComponent implements OnInit, OnChanges {

  constructor() { }
  @Input() chatroom: Chatroom
  lastMessage: MessageModel

  ngOnInit() {
    // TODO: via chat.service fetchen (mitHilfe der jeweiligen Chatroom id)
    this.lastMessage = new MessageModel(1, "ey jo was geht bei dir brooo", new Date(), 1, 1)
  }

  ngOnChanges(changes: SimpleChanges) {
    // this.chatroom = changes.chatroom.currentValue
  }

}
