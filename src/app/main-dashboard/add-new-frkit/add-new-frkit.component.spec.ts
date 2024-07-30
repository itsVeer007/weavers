import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewFrkitComponent } from './add-new-frkit.component';

describe('AddNewFrkitComponent', () => {
  let component: AddNewFrkitComponent;
  let fixture: ComponentFixture<AddNewFrkitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewFrkitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewFrkitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
