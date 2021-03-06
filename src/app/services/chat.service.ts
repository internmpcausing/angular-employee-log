import { SocketService } from './socket.service';
import * as io from "socket.io-client";
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


export interface IMessage{
    _id: string;
    sentAt: number;
    seenAt: number,
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
    public employee: Observable<IEmployee>;
    private _employee: BehaviorSubject<IEmployee>;

    public chatSelectedEmployee: Observable<number>;
    private _chatSelectedEmployee: BehaviorSubject<number>;


    public scollChatBox: Observable<boolean>;
    private _scollChatBox: BehaviorSubject<boolean>;

    public addSmallValueToScrollChatBox: Observable<null>;
    private _addSmallValueToScrollChatBox: BehaviorSubject<null>;

    public doneRequestingAdditionalMessages: Observable<boolean>;
    private _doneRequestingAdditionalMessages: BehaviorSubject<boolean>;

    public noMoreMessage: Observable<boolean>;
    private _noMoreMessage: BehaviorSubject<boolean>;

    constructor(private socketService:SocketService){

        
        this.socket = this.socketService.socket;
        this._employee = <BehaviorSubject<IEmployee>>new BehaviorSubject({});
        this.employee = this._employee.asObservable();

        this._chatSelectedEmployee = <BehaviorSubject<number>>new BehaviorSubject(0);
        this.chatSelectedEmployee = this._chatSelectedEmployee.asObservable();

        this._scollChatBox = <BehaviorSubject<false>>new BehaviorSubject(false);
        this.scollChatBox = this._scollChatBox.asObservable();

        this._addSmallValueToScrollChatBox = <BehaviorSubject<null>>new BehaviorSubject(null);
        this.addSmallValueToScrollChatBox = this._addSmallValueToScrollChatBox.asObservable();

        this._doneRequestingAdditionalMessages = <BehaviorSubject<false>>new BehaviorSubject(false);
        this.doneRequestingAdditionalMessages = this._doneRequestingAdditionalMessages.asObservable();

        this._noMoreMessage = <BehaviorSubject<false>>new BehaviorSubject(false);
        this.noMoreMessage = this._noMoreMessage.asObservable();

        this.socket.on('sv-sendInitMessages', (data) => {
            if(data.messages) data.messages = data.messages.reverse();
            console.log(data.messages);
            

            setTimeout(() => {
                let e = this._employee.getValue();
                let s = true;
                if(e){
                    if((<any>e)._id == data._id){
                        data.messages = (<any>e).messages;
                        s = false;
                    }
                }

                this._employee.next(Object.assign({}, data, {isTyping:false}));
                if(s) this._scollChatBox.next(true);
                
            }, 500);
            
        });

        this.socket.on('sv-sendAdditionalMessages', data => {
            if(!data.messages.length) this._noMoreMessage.next(true);

            let e = Object.assign({}, this._employee.getValue(), {});
            
            setTimeout(() => {
                this._addSmallValueToScrollChatBox.next(null);
                for(let m of data.messages){
                    (<any>e).messages.unshift(m);
                }
                this._employee.next(e);
                this._doneRequestingAdditionalMessages.next(true);
            }, 500)
            
        })

        this.socket.on('sv-employeeTyping', () => {
            this.employeeTyping();
        });

        this.socket.on('sv-newMessage', (data) => {
            console.log(data);
            if(data._m) localStorage.setItem('_m', data._m);
            let employee = Object.assign({}, this._employee.getValue());
            console.log(data);
            // console.log(employee);
            let messages = (<any>employee).messages;
            let m = (<any>messages).find(message => { return  message.secret == data.secret});
            if(!m){
                console.log('New Message');
                (<any>(<any>employee).messages).push(data);
                (<any>employee).isTyping = false;
                this._employee.next(employee);
                this._scollChatBox.next(true);
                
            }
            else{
                
                let message = employee.messages.pop();
                if(!message._id){
                    message._id = data._id;
                }
                employee.messages.push(message);
                this._employee.next(employee);
                console.log('Message Sent!!');
            }
        });

        this.socket.on('sv-seenMessage', (data) => {
            let employee = Object.assign({}, this._employee.getValue());
            employee.messages = employee.messages.map(m => {
                if(data._id === m._id){
                    m.seenAt = data.seenAt;
                }
                return m;
            })
            this._employee.next(employee);
            this._scollChatBox.next(true);
        })

        
    }
    
    loadInitMessages(notificationId, employeeId){
        this._chatSelectedEmployee.next(employeeId);
        this.socket.emit('cl-getInitMessages', {notificationId: notificationId });
    }

    loadAdditionalMessages(){
        let e = this._employee.getValue();
        let sentAt = (<any>e).messages ? (<any>e).messages[0].sentAt : 0;
        let r = Object.assign({}, {
            employeeId: (<any>e)._id,
            sentAt: sentAt
        })
        
        this.socket.emit('cl-getAdditionalMessages', r);
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
        this.socketService.socket.emit('cl-sendNewMessage', Object.assign({}, newMessage, {
            employeeId: (<any>this._employee.getValue())._id,
            company: localStorage.getItem('selectedDemoId')
        }));
        let employee = Object.assign({}, this._employee.getValue());
        (<any>(<any>employee).messages).push(newMessage);
        this._employee.next(employee);
    }

    typing(){
        let employee = Object.assign({}, this._employee.getValue());
        this.socketService.socket.emit('cl-typing', {employeeId: (<any>employee)._id});
    }

    seen(){
        let employee = Object.assign({}, this._employee.getValue());
        if(employee.messages.length){
            let message = employee.messages.pop();
            if(message.isMe && !message.seenAt){
                this.socket.emit('cl-seenMessage', {_id: message._id});
            }
            employee.messages.push(message);
        }
        this._employee.next(employee);
    }
    
}
