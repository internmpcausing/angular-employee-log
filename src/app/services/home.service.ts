import { SocketService } from './socket.service';
import * as io from "socket.io-client";
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';


@Injectable()
export class HomeService{
    constructor(private socketService:SocketService){}

    getRecentEmployeeTimeIns(){
        let observable = new Observable(observer => {
            this.socketService.socket.on('sv-sendRecentTimeIns', (data) => {
                    observer.next(data);
                });
                return () => {
                    this.socketService.socket.disconnect();
                };
        })
        return observable;
    }

    requestRecentEmployeeTimeIns(){ 
        console.log('rwere')
        this.socketService.socket.emit('cl-getRecentTimeIns')
    }
    
}
