import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewAssetComponent } from './add-new-asset.component';

describe('AddNewAssetComponent', () => {
  let component: AddNewAssetComponent;
  let fixture: ComponentFixture<AddNewAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewAssetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
