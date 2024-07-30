import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdInfoComponent } from './ad-info.component';

describe('AdInfoComponent', () => {
  let component: AdInfoComponent;
  let fixture: ComponentFixture<AdInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
