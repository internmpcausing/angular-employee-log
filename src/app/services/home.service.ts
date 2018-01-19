import { SocketService } from './socket.service';
import * as io from "socket.io-client";
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';


@Injectable()
export class HomeService{
    constructor(private socketService:SocketService){}

    getInitMessages(notificationId){
        this.socketService.socket.emit('cl-getInitMessages', {notificationId: notificationId});
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
    
    sendMessage(newMessage){
        this.socketService.socket.emit('cl-sendNewMessage', newMessage);
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
