import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WifiAnalyticsComponent } from './wifi-analytics.component';

describe('WifiAnalyticsComponent', () => {
  let component: WifiAnalyticsComponent;
  let fixture: ComponentFixture<WifiAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WifiAnalyticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WifiAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
