import { IMessage } from './chat.service';
import { SocketService } from './socket.service';
import * as io from "socket.io-client";
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


export interface IMessage{
    sentAt: number;
    content: string;
    isMe: boolean;
}

export interface IEmployee{
    name: object;
    pic: object;
    _id: string;
    messages: Array<IMessage>;
}

@Injectable()
export class ChatService{

    private socket;
    public employee: Observable<IEmployee[]>;
    private _employee: BehaviorSubject<IEmployee[]>;
    constructor(private socketService:SocketService){
        this.socket = this.socketService.socket;
        this._employee = <BehaviorSubject<IEmployee[]>>new BehaviorSubject([]);
        this.employee = this._employee.asObservable();

        this.socket.on('sv-sendInitMessages', (data) => {
            this._employee.next(Object.assign({}, data, {isTyping:false}));
        });

        this.socket.on('sv-employeeTyping', () => {
            this.employeeTyping();
        });

        this.socket.on('sv-newMessage', (data) => {
            let employee = Object.assign({}, this._employee.getValue());
            let messages = (<any>employee).messages;
            let m = (<any>messages).find(message => { return  message.secret == data.secret});

            if(!m){
                console.log('New Message');
                (<any>(<any>employee).messages).push(data);
                this._employee.next(employee);
            }
            else{
                console.log('Message Sent!!');
            }
        });
    }
    
    loadInitMessages(notificationId){
        this.socket.emit('cl-getInitMessages', {notificationId: notificationId });
    }

    timeOutEmployeeTyping;
    ftimeOutEmployeeTyping(){
        this.timeOutEmployeeTyping = setTimeout(() =>{
        let employee = Object.assign({}, this._employee.getValue());
        (<any>employee).isTyping = false;
        this._employee.next(employee);
        }, 1500);
    }

    employeeTyping(){
        clearTimeout(this.timeOutEmployeeTyping);
        let employee = Object.assign({}, this._employee.getValue());
        (<any>employee).isTyping = true;
        this._employee.next(employee);
        this.ftimeOutEmployeeTyping();
    }
    
    send(newMessage){
        this.socketService.socket.emit('cl-sendNewMessage', Object.assign({}, newMessage, {employeeId: (<any>this._employee.getValue())._id}));
        let employee = Object.assign({}, this._employee.getValue());
        (<any>(<any>employee).messages).push(newMessage);
        this._employee.next(employee);
    }

    typing(){
        let employee = Object.assign({}, this._employee.getValue());
        this.socketService.socket.emit('cl-typing', {employeeId: (<any>employee)._id});
    }
    
}
