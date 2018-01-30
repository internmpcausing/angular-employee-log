import { Injectable } from '@angular/core';
import * as io from "socket.io-client";
import { Observable } from 'rxjs/Observable';


@Injectable()
export class SocketService{
    serverAddress = `http://192.168.1.73:8080/`;
    // serverAddress = `localhost:8080`;
    public socket;
    
    constructor(){
        
    }

    connect(){
        this.socket = io(this.serverAddress, {reconnect: true, transports : ['websocket']});
        

        this.socket.on('connect', () => {
            this.socket.emit('cl-adminJoinRoom');
            console.log('socket successfully connected');
        })
        this.socket.on('reconnect', (socket) => {
            this.socket.emit('cl-adminJoinRoom');
            console.log('socket successfully reconnected');
        })
    }
}

  
// socket.on('cl-adminJoinRoom', () => {
//     socket.join('adminRoom');
// })