import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-profile-dropdown-menu',
  templateUrl: './profile-dropdown-menu.component.html',
  styleUrls: ['./profile-dropdown-menu.component.css']
})
export class ProfileDropdownMenuComponent implements OnInit {

  @Output() dropdownClosed: EventEmitter<boolean> = new EventEmitter<boolean>()

  constructor(
    private router: Router,
    private authServie: AuthService
    ) { }

  ngOnInit() {
  }

  onCloseDorpDown() {
    this.dropdownClosed.emit(true)
  }

  onLogout() {
    this.authServie.logout()
    this.router.navigate(["/auth"])
  }

}
