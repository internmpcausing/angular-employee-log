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
        this.socketService.socket.emit('cl-getRecentTimeIns')
    }

    getEmployeeStatus(){
        let observable = new Observable(observer => {
            this.socketService.socket.on('sv-sendEmployeeStatus', (data) => {
                    observer.next(data);
                });
                return () => {
                    this.socketService.socket.disconnect();
                };
        })
        return observable;
    }

    requestEmployeeStatus(_employeeId){
        this.socketService.socket.emit('cl-getEmployeeStatus', {employeeId: _employeeId})
    }
    
}
