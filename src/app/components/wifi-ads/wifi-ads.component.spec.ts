import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WifiAdsComponent } from './wifi-ads.component';

describe('WifiAdsComponent', () => {
  let component: WifiAdsComponent;
  let fixture: ComponentFixture<WifiAdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WifiAdsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WifiAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
