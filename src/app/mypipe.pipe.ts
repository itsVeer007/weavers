import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mypipe'
})
export class MypipePipe implements PipeTransform {

  transform(items: any[], property: string): any[] {
    if (!items) {
      return [];
    }

    const itemMap = new Map();
    
    items.forEach(item => {
      if (itemMap.has(item[property])) {
        const existingItem = itemMap.get(item[property]);
        existingItem.totalInstock += item.totalInstock;
      } else {
        itemMap.set(item[property], { ...item });
      }
    });

    return Array.from(itemMap.values());
  }

}


