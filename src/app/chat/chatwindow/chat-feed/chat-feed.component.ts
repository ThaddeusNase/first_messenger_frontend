import { Component, Input, OnInit } from '@angular/core';
import { Chatroom } from 'src/app/shared/chatroom.model';

@Component({
  selector: 'app-chat-feed',
  templateUrl: './chat-feed.component.html',
  styleUrls: ['./chat-feed.component.css']
})
export class ChatFeedComponent implements OnInit {

  @Input() chatroom: Chatroom;

  constructor() { }

  ngOnInit() {
  }

}
