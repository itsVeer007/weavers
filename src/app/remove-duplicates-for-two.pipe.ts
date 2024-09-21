import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeDuplicatesForTwo'
})
export class RemoveDuplicatesForTwoPipe implements PipeTransform {

  transform(value: any[], field1: string, field2: string, field3:any): any[] {
    if (!value || value.length === 0) {
      return [];
    }

    const uniqueItems = new Map();

    value.forEach(item => {
      const key = `${item[field1]}-${item[field2]}-${item[field3]}`;
      if (!uniqueItems.has(key)) {
        uniqueItems.set(key, item);
      }
    });

    return Array.from(uniqueItems.values());
  }

}
