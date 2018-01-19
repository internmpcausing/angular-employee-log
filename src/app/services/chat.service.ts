import { SocketService } from './socket.service';
import * as io from "socket.io-client";
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';


@Injectable()
export class ChatService{
    constructor(private socketService:SocketService){}

    requestInitMessages(notificationId){ this.socketService.socket.emit('cl-getInitMessages', {notificationId: notificationId })}
    
    displayInitMessages(){
        let observable = new Observable(observer => {
            this.socketService.socket.on('sv-sendInitMessages', (data) => {
                    observer.next(data);
                });
                return () => {
                    this.socketService.socket.disconnect();
                };
        })
        return observable;
    }    
    
    sendMessage(newMessage){ this.socketService.socket.emit('cl-sendNewMessage', newMessage)}

    typing(data){ this.socketService.socket.emit('cl-typing', data)}

    employeeTyping(){
        let observable = new Observable(observer => {
            this.socketService.socket.on('sv-employeeTyping', () => {
                    observer.next();
                });
                return () => {
                    this.socketService.socket.disconnect();
                };
        })
        return observable;
    }

    displayNewMessage(){
        let observable = new Observable(observer => {
            this.socketService.socket.on('sv-newMessageFromEmployee', (data) => {
                    observer.next(data);
                });
                return () => {
                    this.socketService.socket.disconnect();
                };
        })
        return observable;
    }
    
}
