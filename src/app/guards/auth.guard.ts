import { AuthService } from './../services/auth.service';

import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as Rx from "rxjs/Rx";
import { resolve } from 'q';
import { AdminService } from '../services/admin.service';




@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  
  private loggedIn: Observable<any>;
  constructor(private router:Router, private authService:AuthService, private adminService:AdminService){
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    //return this.authService.isLoggedIn(this.router, state.url);
    return new Promise((resolve) => {
      this.authService.isLoggedIn(this.router, state.url, resolve);
    })

    
    
    
  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.adminService.setShowNavigationButton(state.url);
    return this.canActivate(next, state);
  }
}



@Injectable()
export class SelectDemoGuard implements CanActivate, CanActivateChild {
  
  constructor(private router:Router, private authService:AuthService){}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve) => {
      this.authService.checkDemo(this.router, state.url, resolve);
    })

  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(next, state);
  }
}


