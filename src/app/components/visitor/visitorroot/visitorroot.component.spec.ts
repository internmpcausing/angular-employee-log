import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorrootComponent } from './visitorroot.component';

describe('VisitorrootComponent', () => {
  let component: VisitorrootComponent;
  let fixture: ComponentFixture<VisitorrootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitorrootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorrootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
