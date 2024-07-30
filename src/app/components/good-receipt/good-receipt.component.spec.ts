import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodReceiptComponent } from './good-receipt.component';

describe('GoodReceiptComponent', () => {
  let component: GoodReceiptComponent;
  let fixture: ComponentFixture<GoodReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoodReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
