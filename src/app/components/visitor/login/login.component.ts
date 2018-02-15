import { TokenService } from './../../../services/token.service';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService:AuthService, private tokenService:TokenService, private router:Router, private toastr: ToastrService) { }

  ngOnInit() {
  }


  disableControls = false;
  showLoading = false;
  login(username, password){
    this.disableControls = true;
    this.showLoading = true;

    this.authService.authenticate(username.value, password.value).subscribe(data => {
      setTimeout(()=> {
        let _data = Object.assign({}, <any>data);
        this.showLoading = false;

        if(_data.success){
          this.tokenService.setToken('token', _data.token)

          let d:any = Object.assign({}, {successLogin: true});
          this.toastr.show(d, '');

          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 2500)
        } else{
          this.disableControls = false;
          let d:any = Object.assign({}, {failedLogIn: true});
          this.toastr.show(d, '');
        }
      }, 500)
      
    }, err => {
      setTimeout(() => {
        this.login(username, password);
      }, 3000)
      
    });
  }

}
