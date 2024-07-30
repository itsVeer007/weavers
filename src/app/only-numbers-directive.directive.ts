import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyNumbersDirective]'
})
export class OnlyNumbersDirectiveDirective {

  private maxLength = 10; // Maximum length of 6 digits

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Replace all non-numeric characters
    value = value.replace(/[^0-9]/g, '');

    // Trim to max length
    if (value.length > this.maxLength) {
      value = value.slice(0, this.maxLength);
    }

    input.value = value;
    this.el.nativeElement.value = value; // Update the input field
    const eventTrigger = new Event('input', { bubbles: true });
    input.dispatchEvent(eventTrigger);
  }

}
