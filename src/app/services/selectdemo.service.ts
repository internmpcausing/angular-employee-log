import { IModalResponseNewDemo } from './selectdemo.service';
import { TokenService } from './token.service';
import { MyGlobals } from './../globals';

import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import * as Rx from "rxjs/Rx"
import { Router } from '@angular/router';




export interface ICompany{
    _id: string;
    name: string;
    logo: string;
}

export interface IModalResponseNewDemo{
    success: boolean;
    msg: string;
}




@Injectable()
export class SelectDemoService{
    public companies: Observable<ICompany[]>;
    private _companies: BehaviorSubject<ICompany[]>;

    public modalResponse: Observable<IModalResponseNewDemo>;
    private _modalResponse: BehaviorSubject<IModalResponseNewDemo>;

    constructor(private router:Router, private myGlobals:MyGlobals, private tokenService:TokenService, private http: HttpClient){
        this._companies = <BehaviorSubject<ICompany[]>>new BehaviorSubject([]);
        this.companies = this._companies.asObservable();

        this._modalResponse = <BehaviorSubject<IModalResponseNewDemo>>new BehaviorSubject({});
        this.modalResponse = this._modalResponse.asObservable();
    }

    addNew(name: string){
        name = name.trim().toLowerCase();
        let token = this.tokenService.getToken('token');
        console.log(token);
        let httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'JWT '+token,
                'Content-Type': 'application/json',
            })
        }

        this.http.post(`${this.myGlobals.serverAddress}company`, {name:name}, httpOptions)
            .subscribe(data => {
                console.log(data);
                let _data = Object.assign({}, (<any>data));
                if(_data.success){
                    let c = this._companies.getValue();
                    c.push(_data.company);
                    this._companies.next(c);
                }

                let m = Object.assign({}, {
                    success: _data.success,
                    msg: _data.msg
                })
                this._modalResponse.next(m);
                this._modalResponse = <BehaviorSubject<IModalResponseNewDemo>>new BehaviorSubject({});
                this.modalResponse = this._modalResponse.asObservable();
            }, err => {
                console.log(err);
                if(err.status == 401){
                    this.router.navigate(['/login']);
                    return;
                }
            })
    }

    getAll(){
        let token = this.tokenService.getToken('token');
        let httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'JWT '+token,
                'Content-Type': 'application/json',
            })
        }

        this.http.get(`${this.myGlobals.serverAddress}companies`, httpOptions)
            .subscribe(data => {
                
                let _data = Object.assign({}, (<any>data));
                console.log(_data.msg);
                if(_data.success){
                    this._companies.next(_data.companies);
                }
            }, err => {
                console.log(err);
                if(err.status == 401){
                    this.router.navigate(['/login']);
                    return;
                }
            })
    }
}