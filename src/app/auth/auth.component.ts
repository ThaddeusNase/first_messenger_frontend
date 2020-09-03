import { Component, OnInit } from '@angular/core';
import { FormBuilder ,FormGroup, FormControl, Validators } from '@angular/forms';
import { MustMatch } from '../shared/custom-validators';
import {AuthResponseData} from './auth.service' 
import { AuthService } from './auth.service';
import { Data } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  loginMode = false
  isLoading = false

  constructor(private formBuilder: FormBuilder, private authService: AuthService ) { }

  loginForm: FormGroup;
  

  ngOnInit() {
    
    this.loginForm = this.formBuilder.group({
      // TODO: custom Email validators (ob email nicht-/existiert -> in auth service http request
      // http request auch noch in flask-backend erstellen
      email: ["", [Validators.required, Validators.email]], 
      password: ["", [Validators.required, Validators.minLength(6)]],
      password_confirm: ["", Validators.required]
    }, {
        validators: MustMatch("password", "password_confirm")
    })
  }

  onSubmit() {
    // TODO: if loginForm.errors -> submit-button deaktiviert
    console.log(this.loginForm);
    this.isLoading = true
    const email = this.loginForm.value["email"]
    const password = this.loginForm.value["password"]

    let authRequest: Observable<AuthResponseData>

    if (this.loginMode) {
      // TODO: login http post request3
      authRequest = this.authService.login(email, password)
    } else {
      // reguister http post request
      authRequest = this.authService.register(email, password)
    }

    authRequest.subscribe(
      (responseData: AuthResponseData) => {
        console.log("auth Successful", responseData);
        this.isLoading = false
      }
    )
    // TODO: error handeling
  }

  onSwitchMode() {
    console.log("lol");
    this.loginMode = !this.loginMode

  }
  


}
