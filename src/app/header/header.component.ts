import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  loginMode = false

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.loginMode = this.authService.isAuthenticated()
  }

  onLoginLogout(isLoggedIn:boolean){
    // wenn user auf btn drückt, wenn er eingeloggt ist (loginMode = true) -> dann Logout button: ausloggen!
    if (!isLoggedIn) {
      this.router.navigate(["/auth"])
    } else {
      // TODO: wo redirecten wenn user sich ausloggt
      this.authService.logout()
      console.log("user logged out");
      this.router.navigate["/home"]
      
    }
  }

  onOpenChat() {
    this.router.navigate(["/chat"])
  }

}
