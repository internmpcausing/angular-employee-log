
import { VisitorRootComponent } from './components/visitor/visitorroot/visitorroot.component';
import { SelectdemoComponent } from './components/admin/selectdemo/selectdemo.component';
import { AdminComponent } from './components/admin/admin.component';
import { LogsComponent } from './components/admin/logs/logs.component';


import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/admin/home/home.component';
import { AuthGuard, SelectDemoGuard } from './guards/auth.guard';
import { VisitorComponent } from './components/visitor/visitor.component';
import { LoginComponent } from './components/visitor/login/login.component';
import { EmployeesComponent } from './components/admin/employees/employees.component';

const routes: Routes = [
    // { path: 'logs', component: LogsComponent },
    { 
        path: '',
        children: [
            {
                path: 'dashboard',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                component: AdminComponent,
                children: [
                    {
                        path: 'select-demo',
                        component: SelectdemoComponent},
                    {
                        path: '',
                        canActivateChild: [SelectDemoGuard],
                        children: [
                            {path: 'logs', component: LogsComponent},
                            {path: 'employees', component: EmployeesComponent},
                            {path: '', component: HomeComponent},
                        ]
                    }
                ]
            },
            { 
                path: '', 
                children: [
                    {
                        path: 'login', 
                        canActivate: [AuthGuard],
                        component: LoginComponent},
                    {
                        path: '', 
                        canActivateChild: [AuthGuard],
                        component: VisitorComponent,
                        children: [
                            {path: '', component: VisitorRootComponent}
                        ]
                    },
                ]
            }
        ]
    },
    
    
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
    
export class AppRoutingModule {}