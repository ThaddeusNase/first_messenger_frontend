import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/shared/models/user.model';
import { UserResponseData, UsersService } from 'src/app/shared/services/users.service';

@Component({
  selector: 'app-edit-profile-dialog',
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.css']
})
export class EditProfileDialogComponent implements OnInit {

  editProfileForm: FormGroup
  @Input() user: User
  @Output() closeEditProfile = new EventEmitter()
  @Output() userUpdated = new EventEmitter<User>()

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.initEditProfileForm()
  }


  initEditProfileForm() {
    console.log(this.user);
    
    this.editProfileForm = this.formBuilder.group({
      "firstName": [this.user.firstname],
      "surname": [this.user.surname],
      // TODO: bio mit textarea ersetzen
      "bio": [this.user.bio],
    })
    // let controls = this.el.nativeElement.querySelectorAll(".form-control")
    // for(let control of controls) {
    //   console.log("111",control.value);
      
    //   if (!control.value) {
    //     control.classList.add("hide-control")
    //   } 

    // }
  }
  onClose() {
    this.closeEditProfile.emit()
  }

  onSubmit() {
    this.updateUser()
  }

  updateUser() {
    // TODO: const email = this.editProfileForm.controls.email.value ? this.editProfileForm.controls.email.value : this.user.email
    const firstname = this.editProfileForm.controls.firstName.value
    const surname = this.editProfileForm.controls.surname.value
    const bio = this.editProfileForm.controls.bio.value

    const updatedUser = new User(this.user.id, this.user.email, firstname, surname ,bio)    
    this.usersService.updateUser(updatedUser).subscribe(
      (userResData: UserResponseData) => {
        console.log(userResData);
        this.user = updatedUser
        this.userUpdated.emit(updatedUser)
        this.onClose()
      },
      (error: Error) => {
        console.error(error);
        // TODO: this.error = this.error.message
      }
    )
  }

}
