import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit } from '@angular/core';
// TODO: import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Chatroom } from 'src/app/shared/chatroom.model';
import { ChatService } from '../chat.service';
import { ChatroomDialogComponent } from './chatroom-dialog/chatroom-dialog.component';

@Component({
  selector: 'app-chatroom-list',
  templateUrl: './chatroom-list.component.html',
  styleUrls: ['./chatroom-list.component.css']
})
export class ChatroomListComponent implements OnInit {
  
  chatrooms: Chatroom[];

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private chatService: ChatService,
    // TODO: public dialog: MatDialog
  ) {}


  ngOnInit() {
    const sampleChatrooms = [
      new Chatroom(1,new Date(), "first Chatroom"),
      new Chatroom(2,new Date(), "second Chatroom"),
      new Chatroom(3,new Date(), "third Chatroom"),
    ]
    this.chatrooms = sampleChatrooms
  }


  onOpenChatwindow(i:number) {
    console.log(i," executed");
    
    this.router.navigate([i], {relativeTo: this.activatedRoute})
  }


  onCreateChatroom() {
    // // Create Group Dialog öffnen
    // let dialogRef = this.dialog.open(ChatroomDialogComponent, {
    //   height: '400px',
    //   width: '600px',
    // });


    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`); // Pizza!
    //   // TODO: this.chatService.createNewChatroom()
    // });
    
    // dialogRef.close('Pizza!');

    

  }

}
