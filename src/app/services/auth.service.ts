import { AdminService } from './admin.service';
import { TokenService } from './token.service';
import { MyGlobals } from './../globals';

import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import * as Rx from "rxjs/Rx"
import { Router } from '@angular/router';


@Injectable()
export class AuthService{
    public loggedId: Observable<boolean>;
    constructor(private myGlobals:MyGlobals, private adminService:AdminService, private http: HttpClient, private tokenService:TokenService){
    }

    isLoggedIn(router: Router, url, resolve){
        
        let dashboardRoute  = false;
        let splitUrl = url.split('/');
        if (splitUrl.length >= 2){
            if(splitUrl[1] == 'dashboard') dashboardRoute = true;
        }
        
        

        let token = this.tokenService.getToken('token');
        let httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'JWT '+token,
                'Content-Type': 'application/json',
            })
        }

        if(dashboardRoute){
            if(!token){
                router.navigate(['/login']);
                resolve(false);
            }
            else{
                this.http.post(this.myGlobals.serverAddress+ 'check-authentication', {}, httpOptions)
                .subscribe(data => {
                    this.adminService.setAdmin(data);
                    resolve(true);
                }, err => {
                    console.log(err);
                    if(err.status == 401){
                        this.tokenService.removeToken('token');
                        router.navigate(['/login']);
                        resolve(false);
                    }
                    else{
                        setTimeout(() => {
                            this.isLoggedIn(router, url, resolve);
                        }, 3000);
                    }
                })
                
            }
        }
        else{
            if(!token){
                resolve(true);
            }
            else{
                router.navigate(['/dashboard']);
                resolve(false);
            }
        }
    }

    checkDemo(router: Router, url, resolve){
        
        let selectDemoRoute  = false;
        let splitUrl = url.split('/');
        if (splitUrl.length >= 3){
            if(splitUrl[2] == 'select-demo') selectDemoRoute = true;
        }
        
        

        let selectedDemoId = this.tokenService.getToken('selectedDemoId');
        let token = this.tokenService.getToken('token');
        let httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'JWT '+token,
                'Content-Type': 'application/json',
            })
        }

        if(selectDemoRoute){
            resolve(true);
        } else{
            if(!selectedDemoId){
                router.navigate(['/dashboard/select-demo']);
                resolve(false);
            }
            else{
                this.http.get(`${this.myGlobals.serverAddress}company?id=${selectedDemoId}`, httpOptions)
                .subscribe(data => {
                    console.log(data);
                    let _data = Object.assign({}, (<any>data));
                    console.log(_data.msg);
                    
                    if(_data.success){
                        this.adminService.setCompany(_data.company);
                        resolve(true);
                    }
                    else{
                        localStorage.removeItem('selectedDemoId');
                        router.navigate(['/dashboard/select-demo']);
                        resolve(false);
                    }
                }, err => {
                    if(err.status == 401){
                        localStorage.removeItem('selectedDemoId');
                        localStorage.removeItem('token')
                        router.navigate(['/login']);
                        resolve(false);
                    }
                    else{
                        setTimeout(() => {
                            this.checkDemo(router, url, resolve);
                        }, 3000);
                    }
                })
                ;
            }
        }
    }

    authenticate(username, password){

        let user = {
            username: username,
            password: password,
            isAdmin: true
        }

        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            })
        }

        return this.http.post(`${this.myGlobals.serverAddress}authenticate`, user, httpOptions);
    }

}