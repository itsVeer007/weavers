import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  FormControlName,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/services/alert.service';
import { InventoryService } from 'src/services/inventory.service';
import { MetadataService } from 'src/services/metadata.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-add-new-frkit',
  templateUrl: './add-new-frkit.component.html',
  styleUrls: ['./add-new-frkit.component.css'],
  animations: [
    trigger('inOutPaneAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }), //apply default styles before animation starts
        animate(
          '500ms ease-in-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateX(0)' }), //apply default styles before animation starts
        animate(
          '500ms ease-in-out',
          style({ opacity: 0, transform: 'translateX(100%)' })
        ),
      ]),
    ]),
  ],
})
export class AddNewFrkitComponent implements OnInit {
  constructor(
    private inventorySer: InventoryService,
    private router: Router,
    private http:HttpClient,
    private fb: UntypedFormBuilder,
    public alertSer: AlertService,
    public datepipe: DatePipe,
    private storageSer: StorageService,
    private metaDataSer: MetadataService
  ) {}

  @Input() show: any;
  @Output() newItemEvent = new EventEmitter<boolean>();

  UserForm1: any = UntypedFormGroup;
  UserForm2: any = UntypedFormGroup;

  colorCode: any = [
    {
      id: 1,
      colorCode: '#000000',
      color: 'red',
    },
    {
      id: 2,
      colorCode: '#333333',
      color: 'blue',
    },
    {
      id: 3,
      colorCode: '#666666',
      color: 'pink',
    },
    {
      id: 4,
      colorCode: '#999999',
      color: 'yellow',
    },
    {
      id: 5,
      colorCode: '#CCCCCC',
      color: 'green',
    },
  ];

  ticketIdFrmFr: any;
  user: any;
  ngOnInit() {
    this.form1();
    this.form2();
    this.getMetaData();
    this.listProduct();
    this.listClient()
    this.user = JSON.parse(localStorage.getItem('user')!);
    this.getCountry()
  }

  finaldata:any = [];
  listSareesPrices(item?:any) {
    console.log(item)
    this.inventorySer.listSareesPrices(item).subscribe((res:any)=> {
      console.log(res);
      this.finaldata = res;
    })
  }

  listClientRequestsData:any = [];
  listClient() {
    this.inventorySer.listClientRequests().subscribe((res:any)=> {
      console.log(res);
      this.listClientRequestsData = res;
    })
  }


  clientRequestsDataSecond:any;
  listClientRequestsSecond(item?:any, index?:any) {
    this.inventorySer.listClientRequests(item).subscribe((res:any)=> {
      console.log(res)
      this.clientRequestsDataSecond = res;
      this.prductMasterObj.clientName = res.clientName,
      this.prductMasterObj.mobileNumber = res.mobileNumber,
      this.prductMasterObj.emailId = res.emailId,
      this.prductMasterObj.description = res.description,
      this.prductMasterObj.address = res.address,
      console.log(res.state)

      this.prductMasterObj.country = res.country,
      this.prductMasterObj.state = res.state,
      this.prductMasterObj.city = res.city,
      
      this.prductMasterObj.pinCode = res.pinCode
      this.prductMasterObj.gstin = res.gstin,
      this.prductMasterObj.poNo = res.poNo,
      this.prductMasterObj.panNo = res.panNo,
      this.prductMasterObj.poDate = res.poDate

      this.filterStates(res.country)
      this.filterCites(res.state)
      
    })
  }

  resetForm() {
    // Reset the form fields
    this.prductMasterObj.clientName = null,
    this.prductMasterObj.mobileNumber = null
    this.prductMasterObj.emailId = null
    this.prductMasterObj.description = null
    this.prductMasterObj.address = null
    this.prductMasterObj.pinCode = null
    this.prductMasterObj.gstin = null
    this.prductMasterObj.poNo = null
    this.prductMasterObj.panNo = null
    this.prductMasterObj.poDate = null
  
    // If you need to reset the form group
    this.UserForm1.reset();
  }

  prductMasterObj = {
    clientName: null,
        mobileNumber:null,
        emailId: null,
        address:null,
        description:null,
        gstin: null,
        panNo: null,
        poNo:null,
        poDate:null,
        pinCode:null,
        city:null,
        state:null,
        country:null
  }

  productMaster:any;
  listProduct() {
    // this.showLoader = true;
    this.inventorySer.listProduct().subscribe((res: any) => {
      // console.log(res);
      // this.showLoader = false;
      // this.getMetadata();
      this.productMaster = res;

    });
  }

  form1() {
    this.UserForm1 =  this.fb.group({
        'clientName':new UntypedFormControl('',),
        mobileNumber: [
          '',
          [
            Validators.required,
            Validators.maxLength(10),
            Validators.pattern(/^\d*$/) // Only numbers are allowed
          ]
        ],
        'emailId':new UntypedFormControl('', Validators.required),
        'description':new UntypedFormControl(''),
        'address' : new UntypedFormControl('', Validators.required),
        'country': new UntypedFormControl('', Validators.required),
        'state': new UntypedFormControl('', Validators.required),
        'city' : new UntypedFormControl('',Validators.required),
        'pinCode':['', [Validators.required, Validators.maxLength(6)]],
        'gstin': ['', [Validators.required, Validators.maxLength(50)]],
        'panNo': ['', [Validators.required, Validators.maxLength(6)]],
        'poNo': ['', [Validators.required, Validators.maxLength(9)]],
        'poDate': new UntypedFormControl('', Validators.required),
      });
    }

    get mobileNumber1Control() {
      return this.UserForm1.get('mobileNumber1');
    }
  
    onNumberInput(controlName: string, event: Event): void {
      const input = event.target as HTMLInputElement;
      const value = input.value.replace(/[^0-9]/g, '');
  
      if (value.length > 10) {
        input.value = value.slice(0, 10);
        this.UserForm1.controls[controlName].setValue(input.value);
      }
    }

    searchText:any
    searchFunction(event:any) {
      this.searchText = (event.target as HTMLInputElement).value
    }


  form2() {
    this.UserForm2 = this.fb.group({
      type:new UntypedFormControl(null),
      clothType: new UntypedFormControl(null, Validators.required),
      // design: new FormControl(null),
      price: new UntypedFormControl(null, Validators.required),
      color: new UntypedFormControl(null),
      colorCode: new UntypedFormControl(null),
      sareeLength: new UntypedFormControl(null),
      borderColorCode: new UntypedFormControl(null),
      quantity: new UntypedFormControl(null, Validators.required),
      deadline: new UntypedFormControl(null),
      remarks: new UntypedFormControl(null),
    });
  }

  countryList: any;
  getCountry() {
    this.http.get("assets/JSON/countryList.json").subscribe((res: any) => {
      this.countryList = res;
    })
  }


  statesList:any
  filterStates(val:any) {
    let x = this.countryList.filter((item:any) => item.countryName == val)
    let y = x.flatMap((item:any) => item.states);
    this.statesList = y
  }
  citiesList:any;
  filterCites(val:any) {
    let x = this.statesList.filter((item:any)=> item.stateName == val)
    let y = x.flatMap((item:any) => item.cities)
    this.citiesList = y;
  }

  checked:any
  checkFunction() {
    this.checked = !this.checked

  }

  Inactive:boolean = true;
  active:boolean = false;
  activeTwo() {
    this.active = true;
    this.Inactive = false
  }




  createAssignment(payload: any) {
    this.inventorySer.createAssignment(payload).subscribe((res: any) => {
      // console.log(res);
    });
  }
 


  closeAddUser() {
    this.newItemEvent.emit();
  }

  itemCodes: any;
  getItemCodes(slNo: any) {
    this.inventorySer.getItemCodes(slNo).subscribe((res: any) => {
      // console.log(res);
      this.itemCodes = res;
    });
  }

  names: any;
  listInventoryByItemCode(data: any) {
    this.inventorySer.listInventoryByItemCode(data).subscribe((res: any) => {
        this.names = res;
      });
  }

  tasks: any = [];
  add(item: any) {
    console.log(item)
    if(this.UserForm2.valid) {
      let date = item.deadline;
      item.deadline = formatDate(date, 'yyyy-MM-dd', 'en-us');
      item.type = 'Custom Order';
      console.log(item)
      this.tasks.push(item);
      this.UserForm2.reset();
    } else {
      this.alertSer.error('Please fill all fields');
    }
  }

  submitted!: boolean;
  arr: any = [];
  warrantyDetail: any = 'No';
  submit() {
    if(this.UserForm1.valid) {
      this.inventorySer.createClientRequest(this.UserForm1.value,this.tasks).subscribe((res: any) => {
          // console.log(res);
          this.newItemEvent.emit();
          this.alertSer.success(res?.message);
        },
        (err: any) => {
          this.alertSer.error(err?.error?.message);
        }
      );

    }
    // console.log(this.inventoryBody)
  }

  delete(index:any) {
    this.tasks.splice(index, 1)
  }

  checkbox: boolean = false;
  onCheck() {
    this.checkbox = !this.checkbox;
  }

  Price: any;
  SareeLength: any;
  Jacquard_designs: any;
  cloth_type: any;
  metaData: any;
  getMetaData() {
    this.metaData = JSON.parse(localStorage.getItem('metaData')!);
    // console.log(this.metaData);
    this.metaData?.forEach((item: any) => {
      if (item.type === 51) {
        this.cloth_type = item.metadata;
      }
      if (item.type === 52) {
        this.Jacquard_designs = item.metadata;
      }
      if (item.type === 53) {
        this.Price = item.metadata;
      }
      if (item.type === 55) {
        this.SareeLength = item.metadata;
      }
    });
  }
}
