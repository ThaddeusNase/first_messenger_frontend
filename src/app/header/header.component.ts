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
  profileDropdownOpened = false

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.loginMode = this.authService.isAuthenticated()
  }


  onLogin() {
    this.router.navigate(["/auth"])
  }

  onOpenChat() {
    this.router.navigate(["/chat"])
  }

  onOpenDropdown() {
    this.profileDropdownOpened = true
  }

  onCloseDropdown(closed:boolean) {
    this.profileDropdownOpened = false
  }

}
