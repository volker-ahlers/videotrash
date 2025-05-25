import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgSwitcherComponent } from './bg-switcher.component';

describe('BgSwitcherComponent', () => {
  let component: BgSwitcherComponent;
  let fixture: ComponentFixture<BgSwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BgSwitcherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BgSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
