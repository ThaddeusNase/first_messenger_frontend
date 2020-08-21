import { Component, OnInit } from '@angular/core';
import { FormBuilder ,FormGroup, FormControl, Validators } from '@angular/forms';
import { MustMatch } from '../shared/custom-validators';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  loginMode = false

  constructor(private formBuilder: FormBuilder) { }

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
    if (this.loginMode) {
      // login http post request
    } else {
      // reguister http post request
    }
  }

  onSwitchMode() {
    console.log("lol");
    this.loginMode = !this.loginMode
  }
  


}
