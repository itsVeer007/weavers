import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-new-site',
  templateUrl: './add-new-site.component.html',
  styleUrls: ['./add-new-site.component.css'],
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
export class AddNewSiteComponent implements OnInit {

  // @Input() show: any;

  @Output() newItemEvent = new EventEmitter<boolean>();

  // @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
  //   var x = <HTMLElement>document.getElementById(`sites`);
  //   if (x != null) {
  //     if (!x.contains(e.target)) {
  //       this.closeAddSite(false);
  //     }
  //   }
  // }

  closeAddSite() {
    this.newItemEvent.emit();
  }

  constructor(private router: Router) { }

  ngOnInit(): void {
    // console.log(this.show)
  }

  isShown: boolean = false; // hidden by default

  toggleShowOnOff() {
    this.isShown = !this.isShown;
  }

  Monitoring: boolean = false;

  toggleShowMonit() {
    this.Monitoring = !this.Monitoring;
  }

  Business: boolean = false;

  toggleShowBusiness() {
    this.Business = !this.Business;
  }

  existSecuity: boolean = false;

  toggleShowExistSecuity(value: any, type: any) {
    if (type == 'security') {
      if (value == 'on') {
        this.existSecuity = true;
      }
      else {
        this.existSecuity = false;
      }
    }
  }

  internet: boolean = false;

  toggleShowInternet(value: any, type: any) {
    if (type == 'internet') {
      if (value == 'on') {
        this.internet = true;
      }
      else {
        this.internet = false;
      }
    }
  }

  moni: boolean = false;

  monitoring() {
    this.moni = !this.moni;
  }

  intell: boolean = false;

  businessIntell() {
    this.intell = !this.intell;
  }

  // checkbox(e:any, type:any){
  // if(type== 'preinst'){
  //   console.log(e.target.checked, type)
  // }
  //   if (document.querySelector('#bopis:checked')) {
  //     console.log(e.target.checked, type);
  //   }
  // }

  openAnotherForm(newform: any) {
    this.newItemEvent.emit();
    localStorage.setItem('opennewform', newform);
  }

  latitude: any;
  longitude: any;
  getLocation() {
    navigator.geolocation.getCurrentPosition((latlong)=> {
      this.latitude =(latlong.coords.latitude);
      this.longitude = (latlong.coords.longitude);
    }, function () {
      alert('User not allowed')
    }, { timeout: 10000 })
  }

  selectedFile: any = null;
  selectedFiles:  Array<any> = [];

  onFileSelected(event: any) {
    if(typeof(event) == 'object') {
      this.selectedFile = event.target.files[0] ?? null;
      this.selectedFiles.push(this.selectedFile);
    }
  }

  deleteFile() {
    this.selectedFiles.pop();
  }

}
