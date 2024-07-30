import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrKitComponent } from './fr-kit.component';

describe('FrKitComponent', () => {
  let component: FrKitComponent;
  let fixture: ComponentFixture<FrKitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrKitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrKitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
