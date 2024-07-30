import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewBusinessVerticalComponent } from './add-new-business-vertical.component';

describe('AddNewBusinessVerticalComponent', () => {
  let component: AddNewBusinessVerticalComponent;
  let fixture: ComponentFixture<AddNewBusinessVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewBusinessVerticalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewBusinessVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
