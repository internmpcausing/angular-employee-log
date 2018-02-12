import { MyGlobals } from './../globals';

import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import * as Rx from "rxjs/Rx"
import { Router } from '@angular/router';



@Injectable()
export class TokenService{
    constructor(){}

    setToken(name, token){
        localStorage.setItem(name, token);
    }

    getToken(name){
        return localStorage.getItem(name);
    }

    removeToken(name){
        localStorage.removeItem(name);
    }

}