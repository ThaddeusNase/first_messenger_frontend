import { Component, ElementRef, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Data } from '@angular/router';
import { throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { CurrentUser } from '../shared/models/currentuser.model';
import { User } from '../shared/models/user.model';
import { UserResponseData, UsersService } from '../shared/services/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{

  error: string
  user: User;
  currentUser: CurrentUser

  editMode = false


  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {}


  ngOnInit() {
    this.authService.autologin()
    this.fetchUser()
    // TODO: this.authService.currentUser unsubscriben (?)
    this.authService.currentUser.subscribe(
      (user: CurrentUser) => {
        // s. profile.component.html currentUser wird hier bereits gefetched
        this.currentUser = user
      }
    )
  }





  // TODO: security check: user muss eingeloggt sein 


  fetchUser() {
    this.route.data.subscribe(
      (data: Data)  => {
        // TODO: data kann auch st
        const userData: UserResponseData = data["userData"]
        const resolvedUser = new User(userData.uid.toString(), userData.email, userData.first_name, userData.surname, userData.bio )
        if(resolvedUser) {
          this.user = resolvedUser
        } else {
          this.error = "this user is undefined "
          console.error(this.error);
        }
      }, 
      (errorMessage) => {
        console.error(errorMessage);
        this.error = errorMessage
      }
    )
  }

  onUpdateUser(user: User) {    
    this.user = user
  }
  onEditProfile() {
    this.editMode = true
    // this.editProfileForm.controls["firstName"].enable()
    // this.editProfileForm.controls["surname"].enable()
    // this.editProfileForm.controls["bio"].enable()

    // let controls = this.el.nativeElement.querySelectorAll(".form-control")
    // for (let control of controls ) {
    //   control.classList.remove("hide-control")
    //   control.classList.add("show-control")
    //   control.setAttribute("size", 20)
    // }
  }

  
  
  onAddContact() {
  }
  
}
