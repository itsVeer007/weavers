import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/services/alert.service';
import { InventoryService } from 'src/services/inventory.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-add-new-vendor',
  templateUrl: './add-new-vendor.component.html',
  styleUrls: ['./add-new-vendor.component.css'],
    animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)" }),
        animate(
          "500ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }),
        animate(
          "500ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
  ]
})
export class AddNewVendorComponent implements OnInit {

  constructor(
    private router: Router,
    private inventorySer: InventoryService,
    private fb: UntypedFormBuilder,
    public alertSer: AlertService,
    private http: HttpClient,
    private storageSer: StorageService
  ) { }

  @Input() show:any;

  @Output() newItemEvent:any = new EventEmitter<boolean>();

  @Output() newUser = new EventEmitter<any>();

  // @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
  //   var x = <HTMLElement>document.getElementById(`user`);
  //   if (x != null) {
  //     if (!x.contains(e.target)) {
  //       this.closeAddUser(false);
  //     }
  //   }
  // }

  

  vendorForm: any =  UntypedFormGroup;

  vendorBody = {
    vendorName: null,
    proprietorName1: null,
    proprietorName2: null,
    proprietorName3: null,
    emailId1: null,
    emailId2: null,
    emailId3: null,
    mobileNumber1: null,
    mobileNumber2: null,
    mobileNumber3: null,
    status: 1,
    serviceStartDate: null,
    serviceEndDate: null,
    createdTime: null,
    modifiedTime: null,
    createdBy: 1,
    addressLine1: null,
    addressLine2: null,
    country: null,
    state: null,
    postCode: null,
    city: null,
    remarks: null,
    vendorGstin:null
  }

  proparatorTwo: boolean = false;
  proparatorThree: boolean = false;

  activeTwo() {
    // console.log(this.proparatorTwo )
    this.proparatorTwo = !this.proparatorTwo;
  }

  activeThree() {
    this.proparatorThree = !this.proparatorThree;
  }

  user: any;
  ngOnInit() {
    this.vendorForm = this.fb.group({
      'vendorName': new UntypedFormControl('', Validators.required),
      'proprietorName1': new UntypedFormControl('', Validators.required),
      'proprietorName2': new UntypedFormControl(''),
      'proprietorName3': new UntypedFormControl(''),
      'emailId1': new UntypedFormControl('', Validators.required),
      'emailId2': new UntypedFormControl(''),
      'emailId3': new UntypedFormControl(''),
      'mobileNumber1': new UntypedFormControl(''),
      'mobileNumber2': new UntypedFormControl(''),
      'mobileNumber3': new UntypedFormControl(''),
      // mobileNumber1: [
      //   '',
      //   [
      //     Validators.required,
      //     Validators.maxLength(10),
      //     Validators.pattern(/^\d*$/) // Only numbers are allowed
      //   ]
      // ],
      // mobileNumber2: [
      //   '',
      //   [
      //     Validators.required,
      //     Validators.maxLength(10),
      //     Validators.pattern(/^\d*$/) // Only numbers are allowed
      //   ]
      // ],
      // mobileNumber3: ['',[ Validators.required,Validators.maxLength(10),Validators.pattern(/^\d*$/) ]],
      'vendorGstin': new UntypedFormControl(''),

      'status': new UntypedFormControl(''),
      'createdBy': new UntypedFormControl(''),
      'modifiedBy': new UntypedFormControl(''),
      'createdTime': new UntypedFormControl(''),
      'modifiedTime': new UntypedFormControl(''),
      'addressLine1': new UntypedFormControl('', Validators.required),
      'addressLine2': new UntypedFormControl(''),
      'postCode': ['', [Validators.required, Validators.maxLength(6)]],
      'country': new UntypedFormControl('', Validators.required),
      'state': new UntypedFormControl('', Validators.required),
      'city': new UntypedFormControl('', Validators.required),
      'remarks': new UntypedFormControl('')
    });

    this.getCountry();
    this.user =   JSON.parse(localStorage.getItem('user')!);
  }



  get mobileNumber1Control() {
    return this.vendorForm.get('mobileNumber1');
  }
  get mobileNumber2Control() {
    return this.vendorForm.get('mobileNumber2');
  }
  get mobileNumber3Control() {
    return this.vendorForm.get('mobileNumber3');
  }

  onNumberInput(controlName: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '');

    if (value.length > 10) {
      input.value = value.slice(0, 10);
      this.vendorForm.controls[controlName].setValue(input.value);
    }
  }




  emailId1: string = '';
  formattedEmail: string = '';

  updateEmail() {
    const parts = this.emailId1.split('@');
    if (parts.length > 1) {
      const domainParts = parts[1].split('.');
      if (domainParts.length > 1) {
        this.formattedEmail = `${parts[0]}.${domainParts[0]}.${domainParts[1]}`;
      } else {
        this.formattedEmail = this.emailId1;
      }
    } else {
      this.formattedEmail = this.emailId1;
    }
  }

  countryList: any;
  getCountry() {
    this.http.get("assets/JSON/countryList.json").subscribe((res: any) => {
      this.countryList = res;
      // console.log(this.countryList)
    })
  }

  stateList: any = [];
  filterState(val: any) {
    console.log(val)
    let x = this.countryList.filter((item: any) => item.countryName == val);
    let y = x.flatMap((item: any) => item.states);
    console.log(y)
    this.stateList = y;
  }

  cityList: any
  filterCity(val: any) {
    let x = this.stateList.filter((el: any) => el.stateName == val);
    let y = x.flatMap((el: any) => el.cities);
    this.cityList = y;
  }

  closeAddUser() {
    this.newItemEvent.emit();
  }

  openAnotherForm(newform:any) {
    this.newItemEvent.emit();
    localStorage.setItem('opennewform', newform)
  }

  submitted!: boolean;
  submit() {
    // console.log(this.vendorBody);
    if(this.vendorForm.valid) {
      this.alertSer.wait();
      this.vendorForm.value.createdBy = this.user?.UserId;
      this.inventorySer.createVendors(this.vendorForm.value).subscribe((res: any) => {
        // console.log(res);
        this.newItemEvent.emit();
        this.alertSer.success(res?.message);
      }, (err: any) => {
        this.alertSer.error(err?.error?.message);
      })
    }
  }


  checkbox: boolean = false;
  onCheck() {
    this.checkbox = !this.checkbox;
  }

}
