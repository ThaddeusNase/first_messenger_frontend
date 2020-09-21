import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { Url } from 'url';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  onAuthRoute = false // to hide header, wenn user auf "/auth" Page/route ist
  constructor(public router: Router) {}

  ngOnInit() {
  
  }
}
