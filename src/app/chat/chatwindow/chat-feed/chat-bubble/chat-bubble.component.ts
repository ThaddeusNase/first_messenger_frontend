import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { CurrentUser } from 'src/app/shared/models/currentuser.model';
import { MessageModel } from 'src/app/shared/models/message.model';

@Component({
  selector: 'app-chat-bubble',
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.css']
})
export class ChatBubbleComponent implements OnInit {

  @Input() message: MessageModel;
  currentUser: CurrentUser

  testDate: Date

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit() {
     
    this.authService.currentUser.subscribe(
      (currUser: CurrentUser) => {
        this.currentUser = currUser
      }
    )

  }

  

}
