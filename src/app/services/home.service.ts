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

    public showLoading: Observable<boolean>;
    private _showLoading: BehaviorSubject<boolean>;

    private selectedEmployeeId = 0;



    constructor(private socketService:SocketService){
        this.socket = this.socketService.socket;
        this._employees = <BehaviorSubject<IEmployee[]>>new BehaviorSubject([]);
        this.employees = this._employees.asObservable();

        this._selectedEmployee = <BehaviorSubject<IEmployee>>new BehaviorSubject({});
        this.selectedEmployee = this._selectedEmployee.asObservable();

        this._showLoading = <BehaviorSubject<boolean>>new BehaviorSubject(true);
        this.showLoading = this._showLoading.asObservable();
        

        

        this.socket.on('sv-sendRecentTimeIns', (data) => {
            console.log(data);
            this._showLoading.next(false);
            this._employees.next(data);

            let employeeIds = <any>data.map(employee => {
                return employee.id
            })
            this.socket.emit('cl-getInitialAllEmployeeStatus', {employeeIds:employeeIds});
        })
        
        this.socket.on('sv-sendSelectedEmployeeStatus', (data) => {
            if(this.selectedEmployeeId != data.employeeId) return;
            if(data.battery){
                let batteryClass: string;
                let batteryColor;
                if (data.battery.level < 5) batteryClass = 'fa-battery-empty';
                if (data.battery.level > 12) batteryClass = 'fa-battery-quarter';
                if (data.battery.level > 37) batteryClass = 'fa-battery-half';
                if (data.battery.level > 63) batteryClass = 'fa-battery-three-quarters';
                if (data.battery.level > 87) batteryClass = 'fa-battery-full';

                let fColor = (percent) => {
                    let r = percent<50 ? 255 : Math.floor(255-(percent*2-100)*255/100);
                    let g = percent>50 ? 255 : Math.floor((percent*2)*255/100);
                    return 'rgb('+r+','+g+',0)';
                }
                batteryColor = fColor(data.battery.level);
                data.battery = Object.assign({}, data.battery, {batteryClass: batteryClass, batteryColor: batteryColor});
            }

            let e = Object.assign({}, this._selectedEmployee.getValue(), data);
            this._selectedEmployee.next(e);
        })

        this.socket.on('sv-sendEmployeeStatus', data => {
            let m = this._employees.getValue();

            let e = m.map((employee) => {
                if (employee.id == data.id){
                    if(data.currentLocation){
                        employee.currentLocation = Object.assign({}, employee.currentLocation, {
                            lat: data.currentLocation.lat,
                            lng: data.currentLocation.lng
                        })
                    }
                    employee.isOnline = data.isOnline;
                    
                }
                return employee;
            })
            this._employees.next(e);
        })
    }

    loadEmployees(){
        this.socketService.socket.emit('cl-getRecentTimeIns', {company: localStorage.getItem('selectedDemoId')});
    }

    getEmployeeStatus(employeeId){
        this._selectedEmployee.next(Object.assign({}));
        this.selectedEmployeeId = employeeId;
        setTimeout(() => {
            this.socketService.socket.emit('cl-getEmployeeStatus', {employeeId: employeeId});
        }, 500)
        
    }
    
}
