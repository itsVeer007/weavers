import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalsComponent } from './verticals.component';

describe('VerticalsComponent', () => {
  let component: VerticalsComponent;
  let fixture: ComponentFixture<VerticalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerticalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
