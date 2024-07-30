import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaverWorksComponent } from './weaver-works.component';

describe('WeaverWorksComponent', () => {
  let component: WeaverWorksComponent;
  let fixture: ComponentFixture<WeaverWorksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeaverWorksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaverWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
