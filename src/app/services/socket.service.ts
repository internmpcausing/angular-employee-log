import { Injectable } from '@angular/core';
import * as io from "socket.io-client";
import { Observable } from 'rxjs/Observable';


@Injectable()
export class SocketService{
    serverAddress = `http://localhost:8080/`;
    public socket;
    
    constructor(){}

    connect(){
        this.socket = io(this.serverAddress, {reconnect: true, transports : ['websocket']});
        console.log('socket successfully connected');
    }
}

  
