import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QRAdsComponent } from './qr-ads.component';

describe('AddReportsComponent', () => {
  let component: QRAdsComponent;
  let fixture: ComponentFixture<QRAdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QRAdsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QRAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
