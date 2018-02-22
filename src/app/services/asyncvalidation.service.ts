import { MyGlobals } from './../globals';

import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import * as Rx from "rxjs/Rx"
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Injectable()
export class AsyncValidationService{

    token = localStorage.getItem('token');
    httpOptions = {
        headers: new HttpHeaders({
            'Authorization': 'JWT '+ this.token,
            'Content-Type': 'application/json',
        })
    }

    constructor(private myGlobals:MyGlobals, private http: HttpClient){
    }

    usernameDebouncer: any;
    checkUsername(control: FormControl){

        clearTimeout(this.usernameDebouncer);
        return new Promise(resolve => {
            this.usernameDebouncer = setTimeout(() => {
                this.http.post(this.myGlobals.serverAddress+ 'check-username', {username: control.value}, this.httpOptions)
                    .subscribe(res => {
                        let _ok = (<any>res).ok ? null : {usernameTaken: true};
                        resolve(_ok);
                    }, err => {
                        
                    })
            }, 1000)
        }) 
    }

    demoNameDebouncer: any;
    checkDemoName(control: FormControl){

        clearTimeout(this.demoNameDebouncer);
        return new Promise(resolve => {
            this.demoNameDebouncer = setTimeout(() => {
                this.http.post(this.myGlobals.serverAddress+ 'check-demoname', {demoname: control.value}, this.httpOptions)
                    .subscribe(res => {
                        let _ok = (<any>res).ok ? null : {demoNameTaken: true};
                        resolve(_ok);
                    }, err => {
                        
                    })
            }, 1000)
        }) 
    }

}