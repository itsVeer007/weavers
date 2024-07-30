import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewAnalyticComponent } from './add-new-analytic.component';

describe('AddNewAnalyticComponent', () => {
  let component: AddNewAnalyticComponent;
  let fixture: ComponentFixture<AddNewAnalyticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewAnalyticComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewAnalyticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
