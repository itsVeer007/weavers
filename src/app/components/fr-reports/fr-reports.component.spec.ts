import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrReportsComponent } from './fr-reports.component';

describe('FrReportsComponent', () => {
  let component: FrReportsComponent;
  let fixture: ComponentFixture<FrReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
