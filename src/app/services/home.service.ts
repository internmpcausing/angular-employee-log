import { SocketService } from './socket.service';
import * as io from "socket.io-client";
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


export interface IEmployee{
    id: string;
    name: object;
    pic: object;
    isOnline: boolean;
    currentLocation: object;
    
}

@Injectable()
export class HomeService{
    private socket;
    public employees: Observable<IEmployee[]>;
    private _employees: BehaviorSubject<IEmployee[]>;

    public selectedEmployee: Observable<IEmployee>;
    private _selectedEmployee: BehaviorSubject<IEmployee>;

    public showRightSideBar: Observable<boolean>;
    private _showRightSideBar: BehaviorSubject<boolean>;


    constructor(private socketService:SocketService){
        this.socket = this.socketService.socket;
        this._employees = <BehaviorSubject<IEmployee[]>>new BehaviorSubject([]);
        this.employees = this._employees.asObservable();

        this._selectedEmployee = <BehaviorSubject<IEmployee>>new BehaviorSubject({});
        this.selectedEmployee = this._selectedEmployee.asObservable();

        this._showRightSideBar = <BehaviorSubject<boolean>>new BehaviorSubject(false);
        this.showRightSideBar = this._showRightSideBar.asObservable();
        

        

        this.socket.on('sv-sendRecentTimeIns', (data) => {
            console.log(data);
            data[0] = Object.assign({}, data[0], {
                currentLocation: {
                    lat:14.676041,
                    lng: 121.0437
                }
            })

            this._employees.next(data);
        })
        
        this.socketService.socket.on('sv-sendSelectedEmployeeStatus', (data) => {
            console.log(data);

            setTimeout(() => { 
                this._selectedEmployee.next(data);
            }, 500);
        })
    }

    loadEmployees(){
        this.socketService.socket.emit('cl-getRecentTimeIns');
    }

    getEmployeeStatus(employeeId){
        this._selectedEmployee.next(Object.assign({}));
        console.log(employeeId);
        this._showRightSideBar.next(true); 
        this.socketService.socket.emit('cl-getEmployeeStatus', employeeId);
    }

    hideRightSideBar(){
        this._showRightSideBar.next(false); 
    }
    
}
