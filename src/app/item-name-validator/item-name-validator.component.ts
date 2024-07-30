import { Component, OnInit } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-item-name-validator',
  templateUrl: './item-name-validator.component.html',
  styleUrls: ['./item-name-validator.component.css']
})
export class ItemNameValidatorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  itemNameValidator(existingItems: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = existingItems.includes(control.value);
      return forbidden ? { itemNameExists: { value: control.value } } : null;
    }; 
  }

}
