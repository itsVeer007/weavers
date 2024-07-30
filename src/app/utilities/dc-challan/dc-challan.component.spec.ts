import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcChallanComponent } from './dc-challan.component';

describe('DcChallanComponent', () => {
  let component: DcChallanComponent;
  let fixture: ComponentFixture<DcChallanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DcChallanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DcChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
