import { Component, ElementRef, OnInit } from '@angular/core';
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
export class ProfileComponent implements OnInit {

  error: string
  user: User;
  isCurrentUser = false

  editMode = false

  editProfileForm: FormGroup

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private el: ElementRef
  ) {}


  ngOnInit() {
    this.authService.autologin()
    this.fetchUser()
    // TODO: this.authService.currentUser unsubscriben (?)
    this.authService.currentUser.subscribe(
      (user: CurrentUser) => {
        // s. profile.component.html currentUser wird hier bereits gefetched
        console.log("currentUser: ", user);
        console.log("fetchedUser: ", this.user);
        
        console.log(this.user.id === user.id);
        
        this.isCurrentUser = this.user.id === user.id ? true : false
      }
    )

    if (this.isCurrentUser) {
      this.initEditProfileForm()
    }
  }


  // TODO: security check: user muss eingeloggt sein 
  initEditProfileForm() {
    
    this.editProfileForm = this.formBuilder.group({
      "firstName": [{value: this.user.firstname, disabled: true}],
      "surname": [{value: this.user.surname, disabled: true}],
      // TODO: bio mit textarea ersetzen
      "bio": [{value: this.user.bio, disabled: true}],
    })
    // let controls = this.el.nativeElement.querySelectorAll(".form-control")
    // for(let control of controls) {
    //   console.log("111",control.value);
      
    //   if (!control.value) {
    //     control.classList.add("hide-control")
    //   } 

    // }
  }


  fetchUser() {
    this.route.data.subscribe(
      (data: Data)  => {
        // TODO: data kann auch st
        const userData: UserResponseData = data["userData"]

        const resolvedUser = new User(userData.uid.toString(), userData.email, userData.first_name, userData.surname, userData.bio )
        console.log("fetched resolve user: ", resolvedUser);
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


  onEditProfile() {
    this.editMode = true
    this.editProfileForm.controls["firstName"].enable()
    this.editProfileForm.controls["surname"].enable()
    this.editProfileForm.controls["bio"].enable()

    let controls = this.el.nativeElement.querySelectorAll(".form-control")
    for (let control of controls ) {
      control.classList.remove("hide-control")
      control.classList.add("show-control")
      control.setAttribute("size", 20)
    }
  }

  onSubmit() {
    console.log("submited");
    this.handleHideControl()
    this.updateUser()
    
    

  }

  updateUser() {
    // TODO: const email = this.editProfileForm.controls.email.value ? this.editProfileForm.controls.email.value : this.user.email
    const surname = this.editProfileForm.controls.surname.value ? this.editProfileForm.controls.surname.value : this.user.surname
    const firstname = this.editProfileForm.controls.firstName.value ? this.editProfileForm.controls.firstName.value : this.user.firstname
    const bio = this.editProfileForm.controls.bio.value ? this.editProfileForm.controls.bio.value : this.user.bio

    const updatedUser = new User(this.user.id, this.user.email, firstname, surname ,bio)
    console.log("updatedUser: ", updatedUser);
    
    this.usersService.updateUser(updatedUser).subscribe(
      (userResData: UserResponseData) => {
        console.log(userResData);
      },
      (error: Error) => {
        console.error(error);
        // TODO: this.error = this.error.message
      }
    )
  }

  handleHideControl() {
    this.editProfileForm.controls["firstName"].disable()
    this.editProfileForm.controls["surname"].disable()
    this.editProfileForm.controls["bio"].disable()
    this.editMode = false

    let controls = this.el.nativeElement.querySelectorAll(".form-control")
    for (let control of controls ) {
      if (!control.value) {
        control.classList.add("hide-control")
      } else {
        control.setAttribute("size", control.value.length)
      }
    }

  }
  
  
  onAddContact() {
  }
  
}
