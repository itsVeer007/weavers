import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemNameValidatorComponent } from './item-name-validator.component';

describe('ItemNameValidatorComponent', () => {
  let component: ItemNameValidatorComponent;
  let fixture: ComponentFixture<ItemNameValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemNameValidatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemNameValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
