import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { CurrentUser} from 'src/app/shared/models/currentuser.model';

@Component({
  selector: 'app-profile-dropdown-menu',
  templateUrl: './profile-dropdown-menu.component.html',
  styleUrls: ['./profile-dropdown-menu.component.css']
})
export class ProfileDropdownMenuComponent implements OnInit {

  @Output() dropdownClosed: EventEmitter<boolean> = new EventEmitter<boolean>()
  currentUserSubscription: Subscription


  constructor(
    private router: Router,
    private authService: AuthService
    ) {}

  ngOnInit() {
    this.authService.autologin()
  }

  onCloseDorpDown() {
    this.dropdownClosed.emit(true)
  }

  onLogout() {
    this.authService.logout()
    this.router.navigate(["/auth"])
  }

  onProfile() {
    this.currentUserSubscription = this.authService.currentUser.subscribe(
      (user: CurrentUser) => {
        this.router.navigate(["profile", user.id])
        this.dropdownClosed.emit(true)
      }
    ) 
    // WICHTIG: da sonst immer wieder zu profile/id navigiert wird
    this.currentUserSubscription.unsubscribe()
  }

}
