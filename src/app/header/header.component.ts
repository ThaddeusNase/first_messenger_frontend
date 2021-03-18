import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { exhaustMap, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { ChatService, MessageData } from '../chat/chat.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  loginMode = false
  profileDropdownOpened = false

  // TODO: Logik implementieren = für neue Nachrichten (gelesen und nicht gelesen!)
  newMessagesAmount:number = 0

  constructor(
    private authService: AuthService, 
    private router: Router,
    private chatService: ChatService, 
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loginMode = this.authService.isAuthenticated()

    this.chatService.observeMessage().subscribe(
      (msgData: MessageData) => {
        // TODO: Logik implementieren = für neue Nachrichten (gelesen und nicht gelesen!)
        if (!this.router.url.includes("chat")) {
          this.newMessagesAmount += 1 
        }
      }
    )
  }

  onLogin() {
    this.router.navigate(["/auth"])
  }

  onOpenChat() {
    this.router.navigate(["/chat"])
    this.newMessagesAmount = 0
  }

  onOpenDropdown() {
    this.profileDropdownOpened = true
  }

  onCloseDropdown(closed:boolean) {
    this.profileDropdownOpened = false
  }

}
