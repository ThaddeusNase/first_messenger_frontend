import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Chatroom } from 'src/app/shared/models/chatroom.model';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.css']
})
export class ChatHeaderComponent implements OnInit, OnChanges {

  @Input() chatpartner: User;
  @Input() chatroom: Chatroom


  constructor() { }

  ngOnInit() {
    // console.log("---room_windowheader: ",this.chatroom);
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log("---room_windowheader: ");
    

  }

}
