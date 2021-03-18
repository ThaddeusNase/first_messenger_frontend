import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Chatroom } from 'src/app/shared/models/chatroom.model';
import { MessageModel } from 'src/app/shared/models/message.model';
import { ChatService, MessageData } from '../chat.service';

@Component({
  selector: 'app-chatroom-list',
  templateUrl: './chatroom-list.component.html',
  styleUrls: ['./chatroom-list.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush 
})
export class ChatroomListComponent implements OnInit {
  
  // chatroomsExist: boolean = false;
  @Input() chatrooms: Chatroom[] = [];

  newMessages: MessageModel[] =   []


  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private chatService: ChatService,
  ) {}


  ngOnInit() {
    // TODO: mit observable erstetzen und besseres handeleing -> message jeweiligem chatroom/chatfeed zuordnen etc
    this.chatService.observeMessage().subscribe(
      (msgData: MessageData) => {
        const newMessage: MessageModel = new MessageModel(msgData.id, msgData.content, msgData.delivery_time, +msgData.room_id, +msgData.author_id)

      }
    )
  }

}
