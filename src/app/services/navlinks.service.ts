import { Injectable } from "@angular/core";

Injectable()
export class NavLinks{
    navLinks = [
        {
            path: '/',
            label: 'Home',
            isActive: false
        },
        {
            path: '/logs',
            label: 'Logs',
            isActive: false
        }
    ];

    selectedNavlink(index){
        for(let nav of this.navLinks){
            nav.isActive = false;
        }
        this.navLinks[index].isActive = true;
    }
}