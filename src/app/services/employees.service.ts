import { SocketService } from './socket.service';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as Rx from "rxjs/Rx";




export interface IEmployee{
    id?: string;
    companyId?: string;
    name: Object;
    pic: Object;
    username: string;
    password: string;
    update?: boolean;
    add?: boolean;

}

export interface IModalResponseNewDemo{
    success: boolean;
    msg: string;
}




@Injectable()
export class EmployeesService{
    public employees: Observable<IEmployee[]>;
    private _employees: BehaviorSubject<IEmployee[]>;

    public employee: Observable<IEmployee>;
    private _employee: BehaviorSubject<IEmployee>;

    public modalResponse: Observable<IModalResponseNewDemo>;
    private _modalResponse: BehaviorSubject<IModalResponseNewDemo>;

    private socket;

    constructor(private socketService:SocketService){
        this.socket = this.socketService.socket;
        this._employees = <BehaviorSubject<IEmployee[]>>new BehaviorSubject([]);
        this.employees = this._employees.asObservable();

        this._employee = <BehaviorSubject<IEmployee>>new BehaviorSubject({});
        this.employee = this._employee.asObservable();

        this._modalResponse = <BehaviorSubject<IModalResponseNewDemo>>new BehaviorSubject({});
        this.modalResponse = this._modalResponse.asObservable();

        this.socket.on('sv-sendAllEmployees', data => {
            this._employees.next(data);
            console.log(this._employees.getValue());
        });

        this.socket.on('sv-saveEmployee', data => {
            if(data.success){

                if(data.add){
                    let e = (<any>(this._employees.getValue())).slice();
                    <any>e.push(data.employee);
                    this._employees.next(e);
                }
            }
            this._modalResponse.next({
                success: data.success,
                msg: data.msg
            });
            this._modalResponse = <BehaviorSubject<IModalResponseNewDemo>>new BehaviorSubject({});
            this.modalResponse = this._modalResponse.asObservable();
            

        })
    }

    addEmployee(employee:IEmployee){
        employee = Object.assign({}, employee, {
            company: localStorage.getItem('selectedDemoId'),
            add: true
        })

        this.socket.emit('cl-saveEmployee', employee);
    }

    getAllEmployee(){
        this.socket.emit('cl-getAllEmployee', {company: localStorage.getItem('selectedDemoId')})
    }
}