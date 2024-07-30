import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewDcComponent } from './add-new-dc.component';

describe('AddNewDcComponent', () => {
  let component: AddNewDcComponent;
  let fixture: ComponentFixture<AddNewDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
