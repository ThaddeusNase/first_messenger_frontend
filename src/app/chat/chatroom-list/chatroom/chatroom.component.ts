import { Component, Input, OnInit } from '@angular/core';
import { Chatroom } from 'src/app/shared/chatroom.model';
import { MessageModel } from 'src/app/shared/message.model';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {

  constructor() { }
  @Input() chatroom: Chatroom
  lastMessage: MessageModel

  ngOnInit() {
    // TODO: via chat.service fetchen (mitHilfe der jeweiligen Chatroom id)
    this.lastMessage = new MessageModel(1, "ey jo was geht bei dir brooo", new Date(), 1, 1)
  }

}
