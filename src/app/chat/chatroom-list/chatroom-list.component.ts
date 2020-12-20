import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Chatroom } from 'src/app/shared/chatroom.model';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chatroom-list',
  templateUrl: './chatroom-list.component.html',
  styleUrls: ['./chatroom-list.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush 
})
export class ChatroomListComponent implements OnInit {
  
  // chatroomsExist: boolean = false;
  @Input() chatrooms: Chatroom[] = [];
  openedChatroom: Chatroom;


  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private chatService: ChatService,
  ) {}


  ngOnInit() {
  }

  onOpenChatroom(i) {
    const openedChatroom = this.chatrooms[i]
    this.openedChatroom = new Chatroom(openedChatroom.id, openedChatroom.creationDate, openedChatroom.name, openedChatroom.member_limit)
    this.router.navigate(["chat", openedChatroom.id])
  }

  chatroomOpenedCheck(i) {
    if (this.openedChatroom && this.chatrooms && this.chatrooms[i].id === this.openedChatroom.id) {
      return true 
    }
    return false
  }

}
