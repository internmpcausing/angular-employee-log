
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ChatService } from './chat.service';

export interface IAdmin{
    _id: string;
    name: Object;
    pic: Object;
}


export interface ICompany{
    _id: string;
    name: string;
    logo: string;
}

@Injectable()
export class AdminService{
    public chatSelectedEmployeeId: Observable<number>;
    private _chatSelectedEmployeeId: BehaviorSubject<number>;

    public logsBadgeCount: Observable<number>;
    private _logsBadgeCount: BehaviorSubject<number>;

    public admin: Observable<IAdmin>;
    private _admin: BehaviorSubject<IAdmin>;

    public company: Observable<ICompany>;
    private _company: BehaviorSubject<ICompany>;

    public showNavigationButton: Observable<boolean>;
    private _showNavigationButton: BehaviorSubject<boolean>;

    constructor(){
        this._chatSelectedEmployeeId = <BehaviorSubject<number>>new BehaviorSubject(0);
        this.chatSelectedEmployeeId = this._chatSelectedEmployeeId.asObservable();

        this._logsBadgeCount = <BehaviorSubject<number>>new BehaviorSubject(0);
        this.logsBadgeCount = this._logsBadgeCount.asObservable();

        this._admin = <BehaviorSubject<IAdmin>>new BehaviorSubject({});
        this.admin = this._admin.asObservable();

        this._company = <BehaviorSubject<ICompany>>new BehaviorSubject({});
        this.company = this._company.asObservable();

        this._showNavigationButton = <BehaviorSubject<boolean>>new BehaviorSubject(false);
        this.showNavigationButton = this._showNavigationButton.asObservable();
    }

    changeChatSelectedEmployeeId(employeeId){
        this._chatSelectedEmployeeId.next(employeeId);
    }

    changeLogsBadgeCount(isAdd){
        let x = this._logsBadgeCount.getValue();
        if(!isAdd && !x) return;
        
        x = isAdd ? ++x : --x;
        this._logsBadgeCount.next(x);
    }

    getInitialLogsBadgeCount(count){
        this._logsBadgeCount.next(count);
    }

    setAdmin(admin){
        this._admin.next(admin);
    }

    setCompany(company){
        this._company.next(company);
    }

    setShowNavigationButton(url){
        let s = true;
        let splitUrl = url.split('/');
        if (splitUrl.length >= 3){
            if(splitUrl[2] == 'select-demo') s = false;
        }
        this._showNavigationButton.next(s);
    }

}