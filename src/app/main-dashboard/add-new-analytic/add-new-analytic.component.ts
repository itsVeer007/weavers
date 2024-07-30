import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MetadataService } from 'src/services/metadata.service';

@Component({
  selector: 'app-add-new-analytic',
  templateUrl: './add-new-analytic.component.html',
  styleUrls: ['./add-new-analytic.component.css'],
  animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)", }), //apply default styles before animation starts
        animate(
          "500ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)", }), //apply default styles before animation starts
        animate(
          "500ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
  ]
})
export class AddNewAnalyticComponent implements OnInit {


  // @Input() show:any;
  @Output() newItemEvent = new EventEmitter<boolean>();

  // @Output() newUser = new EventEmitter<any>();

  // @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
  //   var x = <HTMLElement>document.getElementById(`camera`);
  //   if (x != null) {
  //     if (!x.contains(e.target)) {
  //       this.closeAddCamera(false);
  //     }
  //   }
  // }

  addAssetForm: any = UntypedFormGroup;

  shortLink: string = "";
  file: File | null = null;
  // loading: boolean = false;

  constructor(private router: Router, private fb: UntypedFormBuilder, private dropDown: MetadataService) { }

  ngOnInit(): void {
    this.addAssetForm = this.fb.group({
      'description': new UntypedFormControl(''),
      'siteId': new UntypedFormControl(''),
      'deviceId': new UntypedFormControl(''),
    });

    // this.ongetDeviceType();
  }

  onChange(event: any) {
    this.file = event.target.files[0];
  }

  closeAddCamera() {
    this.newItemEvent.emit();
  }

  // openAnotherForm(newform:any) {
  //   // this.newItemEvent.emit();
  //   localStorage.setItem('opennewform', newform)
  //   this.closeAddCamera(false);
  // }

  // deviceType: Array<any> = [];
  // ongetDeviceType() {
  //   this.dropDown.getDeviceType().subscribe((res: any) => {
  //     this.deviceType = res;
  //     console.log(res)
  //     console.log(this.deviceType);
  //   })
  // }

  addNewAsset() {
    // console.log(this.addAssetForm.value);
  }

}
