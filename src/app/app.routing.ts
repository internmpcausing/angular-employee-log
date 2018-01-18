import { LogsComponent } from './components/logs/logs.component';


import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
    { path: 'logs', component: LogsComponent },
    { path: '', component: HomeComponent }
    
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
    
export class AppRoutingModule {

}

export const routingComponents = [
    LogsComponent
];