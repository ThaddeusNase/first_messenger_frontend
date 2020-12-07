import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
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
  @Input() chatrooms: Chatroom[];
  @Output() openDialog = new EventEmitter()

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private chatService: ChatService,
  ) {}


  ngOnInit() {
  }

  onOpenChatwindow(i:number) {
    const openedChatroom = this.chatrooms[i]
    console.log("---openedChatroom.id: " ,openedChatroom.id);
    this.router.navigate([openedChatroom.id], {relativeTo: this.activatedRoute})
  }

  onCreateChatroom() {
    this.openDialog.emit()
  }


}
