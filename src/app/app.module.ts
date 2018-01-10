
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//ngx-bootstrap Modules
import { AlertModule, BsDropdownModule } from 'ngx-bootstrap';
import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
import { MapService } from './Services/googlemaps.service';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AlertModule.forRoot(),
    BsDropdownModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDuOss95cF1Xa6hfbn7M_fC7plWH9GCnj8'
    })
  ],
  providers: [MapService],
  bootstrap: [AppComponent]
})
export class AppModule { }
