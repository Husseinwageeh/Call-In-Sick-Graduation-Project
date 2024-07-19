import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadingSuccessComponent } from './reading-success.component';

describe('ReadingSuccessComponent', () => {
  let component: ReadingSuccessComponent;
  let fixture: ComponentFixture<ReadingSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadingSuccessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReadingSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
