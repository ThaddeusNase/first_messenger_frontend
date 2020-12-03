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


  ngOnChanges(changes: SimpleChanges) {
    console.log("---", changes.chatrooms);
    // console.log("---simpleChanges: ", this.chatrooms);
    

    // check if chatrooms exist/are fetched from chat.component.ts via @Input chatrooms 
    // if (this.chatrooms) {
    //   this.useChatrooms(this.chatrooms)
    // }
  }

  // useChatrooms(chatrooms: Chatroom[]) {
  //   this.chatroomsExist = true
    
  // }

  onOpenChatwindow(i:number) {
    console.log(i," executed");
    
    this.router.navigate([i], {relativeTo: this.activatedRoute})
  }

  onCreateChatroom() {
    this.openDialog.emit()
  }


}
