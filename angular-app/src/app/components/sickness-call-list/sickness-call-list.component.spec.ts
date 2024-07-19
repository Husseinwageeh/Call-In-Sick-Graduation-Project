import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SicknessCallListComponent } from './sickness-call-list.component';

describe('SicknessCallListComponent', () => {
  let component: SicknessCallListComponent;
  let fixture: ComponentFixture<SicknessCallListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SicknessCallListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SicknessCallListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
