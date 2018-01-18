import { SocketService } from './socket.service';
import * as io from "socket.io-client";
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';


@Injectable()
export class NotificationService{
    constructor(private socketService:SocketService){}


    getInitNotif(){
        this.socketService.socket.emit('cl-getInitNotif');
        let observable = new Observable(observer => {
            this.socketService.socket.on('sv-sendInitNotif', (data) => {
                    observer.next(data);    
                });
                return () => {
                    this.socketService.socket.disconnect();
                };  
        })
        return observable;
    }

    getNotifDetails(notification){
        this.socketService.socket.emit('cl-getNotifDetails',{id: notification.id});
        let observable = new Observable(observer => {
            this.socketService.socket.on('sv-serveNotifDetails', (data) => {
                    observer.next(data);    
                });
                return () => {
                    this.socketService.socket.disconnect();
                };  
        })
        return observable;
    }

    newNotification(){
        let observable = new Observable(observer => {
            this.socketService.socket.on('sv-newNotification', (data) => {
                    observer.next(data);    
                });
                return () => {
                    this.socketService.socket.disconnect();
                };  
        })
        return observable;
    }
    
}
