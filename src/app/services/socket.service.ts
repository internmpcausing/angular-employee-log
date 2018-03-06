import { MyGlobals } from './../globals';
import { Injectable } from '@angular/core';
import * as io from "socket.io-client";
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class SocketService{
    
    
    public socket;
    
    private currentRoute;
    constructor(private myGlobals:MyGlobals, private router:Router){
        this.router.events.subscribe((res) => {
            this.currentRoute = this.router.url;
          })
    }

    connect(){
        this.socket = io(this.myGlobals.serverAddress, {
            reconnect: true, 
            transports : ['polling', 'websocket'],
            query: {
                token: localStorage.getItem('token')
              }
        });

        this.socket.on('reconnect_attempt', () => {
            this.socket.io.opts.query = {
                token: localStorage.getItem('token')
              }
        })

        this.socket.on('connect', () => {
            let rooms = [];
            if (localStorage.getItem('selectedDemoId')) rooms.push(localStorage.getItem('selectedDemoId'));
            if (localStorage.getItem('selectedEmployeeId')) rooms.push(localStorage.getItem('selectedEmployeeId'))
            this.joinRooms(rooms);
            console.log('socket successfully connected');
            
        })

        this.socket.on('reconnect', () => {
            let rooms = [];
            if (localStorage.getItem('selectedDemoId')) rooms.push(localStorage.getItem('selectedDemoId'));
            if (localStorage.getItem('selectedEmployeeId')) rooms.push(localStorage.getItem('selectedEmployeeId'))
            this.joinRooms(rooms);

            console.log('socket successfully reconnected');

            let s = localStorage.getItem('selectedDemoId');
            if((this.currentRoute != '/dashboard/select-demo') && s){
            this.socket.emit('cl-getLatestUpdate', {
                _t: localStorage.getItem('_t'),
                _m: localStorage.getItem('_m')
            });
            }

        })
        
        this.socket.on('error', err => {
            console.log(err);
            this.socket.disconnect();
            localStorage.removeItem('token');
            this.router.navigate(['/login']);
        })

    }

    joinRooms(rooms){
        this.socket.emit('cl-adminJoinRooms', {rooms: rooms});
    }

    leaveRooms(){
        this.socket.emit('cl-adminLeaveRooms');
    }

    leaveOneRoom(room){
        this.socket.emit('cl-adminLeaveOneRoom', {room: room});
    }

    leaveAndJoinRoom(roomLeave, roomJoin){
        this.socket.emit('cl-adminLeaveAndJoinRoom', {roomLeave: roomLeave, roomJoin:roomJoin});
    }
}

  
// socket.on('cl-adminJoinRoom', () => {
//     socket.join('adminRoom');
// })