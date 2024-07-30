import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdditionalSiteComponent } from './add-additional-site.component';

describe('AddAdditionalSiteComponent', () => {
  let component: AddAdditionalSiteComponent;
  let fixture: ComponentFixture<AddAdditionalSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAdditionalSiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAdditionalSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
