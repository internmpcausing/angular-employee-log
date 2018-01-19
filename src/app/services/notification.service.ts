import { SocketService } from './socket.service';
import * as io from "socket.io-client";
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';


@Injectable()
export class NotificationService{
    constructor(private socketService:SocketService){}


    requestInitNotif(){
        this.socketService.socket.emit('cl-getInitNotif');
    }

    displayInitNotif(){
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

    requestNotifDetails(notification){
        this.socketService.socket.emit('cl-getNotifDetails',{id: notification.id});

    }

    displayNotifDetails(){
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

    newNotif(){
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
