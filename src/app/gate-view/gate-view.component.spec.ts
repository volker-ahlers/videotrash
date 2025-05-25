import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GateViewComponent } from './gate-view.component';

describe('GateViewComponent', () => {
  let component: GateViewComponent;
  let fixture: ComponentFixture<GateViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GateViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
