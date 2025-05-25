import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelfilterComponent } from './panelfilter.component';

describe('PanelfilterComponent', () => {
  let component: PanelfilterComponent;
  let fixture: ComponentFixture<PanelfilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelfilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PanelfilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
