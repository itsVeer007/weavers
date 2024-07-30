import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-new-business-vertical',
  templateUrl: './add-new-business-vertical.component.html',
  styleUrls: ['./add-new-business-vertical.component.css'],
  animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)" }), //apply default styles before animation starts
        animate(
          "500ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }), //apply default styles before animation starts
        animate(
          "500ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
  ]
})
export class AddNewBusinessVerticalComponent implements OnInit {

  @Input() show:any;

  @Output() newItemEvent = new EventEmitter<any>();

  // @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
  //   var x = <HTMLElement>document.getElementById(`vertical`);
  //   if (x != null) {
  //     if (!x.contains(e.target)) {
  //       this.closeAddVertical(false);
  //     }
  //   }
  // }

  closeAddVertical() {
    this.newItemEvent.emit();
  }

  constructor(
    private router:Router
  ) { }

  ngOnInit(): void {
  }

  openAnotherForm(newform:any) {
    this.newItemEvent.emit();
    localStorage.setItem('opennewform', newform)
    // this.closeAddVertical();
  }

}
