import { Component, OnInit } from '@angular/core';
import { FormBuilder ,FormGroup, FormControl, Validators } from '@angular/forms';
import { MustMatch } from '../shared/validators/custom-validators';
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
  errorMsg = ""

  constructor(private formBuilder: FormBuilder, private authService: AuthService ) { }

  loginForm: FormGroup;
  

  ngOnInit() {
    this.loginFormInit()
  }

  private loginFormInit() {
    this.loginForm = this.formBuilder.group({
      // TODO: custom Email validators (ob email nicht-/existiert -> in auth service http request
      // http request auch noch in flask-backend erstellen
      email: ["", [Validators.required, Validators.email]], 
      password: ["", [Validators.required, Validators.minLength(6)]],
      password_confirm: ["", Validators.required]
    }, {
        validators:  MustMatch("password", "password_confirm")
    })
  }


  onSubmit() {
    // TODO: if loginForm.errors -> submit-button deaktiviert
    this.isLoading = true
    const email = this.loginForm.value["email"]
    const password = this.loginForm.value["password"]

    let authRequest: Observable<AuthResponseData>

    if (this.loginMode) {
      // TODO: login http post request3
      this.authenticate(this.authService.login(email, password))
    } else {
      // register http post request
      this.authenticate(this.authService.register(email, password))
    }
  }


  onSwitchMode() {
    this.loginMode = !this.loginMode

    if (this.loginMode === true) {
      this.loginForm.get(["password_confirm"]).disable()
      
    } else {
      this.loginForm.get(["password_confirm"]).enable()
    }
  }




  // ----------- HELPERS ---------------

  // TODO: eigene Datei? s. wie bei indico: utils oder so
  authenticate(authRequest: Observable<AuthResponseData>) {
    authRequest.subscribe(
      (responseData: AuthResponseData) => {
        this.isLoading = false
      }
    ,(errorMessage) => {
      console.error("---",errorMessage);
      
      this.errorMsg = errorMessage
      this.errorMessageAnimtationTime()
      this.isLoading = false
    })
  }

  // damit errorMessage animation auch wieder nach 3s dismissed 
  errorMessageAnimtationTime() {
    setTimeout(() => {
      this.errorMsg = null
    }, 3000)
  }

}
