import { Injectable, OnInit } from "@angular/core";
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { isObject } from 'util';
import { AuthService } from '../auth/auth.service';
import { User } from '../shared/user.model';

@Injectable({providedIn: "root"})
export class ChatService {
    
}