import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'itemNameValidator'
})
export class ItemNameValidatorPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
