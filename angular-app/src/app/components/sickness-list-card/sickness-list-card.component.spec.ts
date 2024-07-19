import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SicknessListCardComponent } from './sickness-list-card.component';

describe('SicknessListCardComponent', () => {
  let component: SicknessListCardComponent;
  let fixture: ComponentFixture<SicknessListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SicknessListCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SicknessListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
