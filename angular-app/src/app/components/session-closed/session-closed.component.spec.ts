import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionClosedComponent } from './session-closed.component';

describe('SessionClosedComponent', () => {
  let component: SessionClosedComponent;
  let fixture: ComponentFixture<SessionClosedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessionClosedComponent]
    });
    fixture = TestBed.createComponent(SessionClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
