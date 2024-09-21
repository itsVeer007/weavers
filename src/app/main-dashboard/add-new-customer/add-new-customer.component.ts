import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, FormArray, UntypedFormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { InventoryService } from 'src/services/inventory.service';
import { MetadataService } from 'src/services/metadata.service';
import { StorageService } from 'src/services/storage.service';
import { TaxInvoiceComponent } from 'src/app/components/tax-invoice/tax-invoice.component';
import { HttpClient } from '@angular/common/http';
import { color } from 'highcharts';

@Component({
  selector: 'app-add-new-customer',
  templateUrl: './add-new-customer.component.html',
  styleUrls: ['./add-new-customer.component.css'],
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
export class AddNewCustomerComponent implements OnInit {

  @Input() fromSites: any;
  @Output() newItemEvent = new EventEmitter<boolean>();

  addDevice: any =  UntypedFormGroup;
  searchText: any;

  constructor(
    private http : HttpClient,
    private fb: UntypedFormBuilder,
    private assetSer: AssetService,
    private dropDown: MetadataService,
    private alertSer: AlertService,
    public dialog: MatDialog,
    private storageSer: StorageService,
    private inventorySer: InventoryService,
    private storage: StorageService
  ) { }

  siteData: any;

  // inventoryBody: any = {
  //   recipientName:null,
  //   itemCode: null,
  //   color: null,
  //   colorCode: null,
  //   quality: null,
  //   cost: null,
  //   price:null,
  //   quantity:null,
  // }

  
  userForm1: any = UntypedFormGroup
  userForm2: any = UntypedFormGroup
  userForm3: any = UntypedFormGroup
  user: any;
  ngOnInit() {
    this.user= JSON.parse(localStorage.getItem('user')!)
    this.listProduct()
    this.form2();
    this.form1();
    this.form3();
    this.listClientRequests()
    this.getCountry();
  }
  local:any
  localCustomer() {
this.local = true;
  }

  countryList: any;
  getCountry() {
    this.http.get("assets/JSON/countryList.json").subscribe((res: any) => {
      this.countryList = res;
    })
  }

  statesList:any
  filterSites(val:any) {
    let x = this.countryList.filter((item:any) => item.countryName == val)
    let y = x.flatMap((item:any) => item.states)
    this.statesList = y
  }
  citiesList:any;
  filterCites(val:any) {
    let x = this.statesList.filter((item:any)=> item.stateName == val)
    let y = x.flatMap((item:any) => item.cities)
    this.citiesList = y;
    // console.log(this.citiesList)
  }

  listClientRequestsData:any = [];
  listClientRequests() {
    this.inventorySer.listClientRequests().subscribe((res:any)=> {
      // console.log(res)  ;   
      this.listClientRequestsData = res;
    })
  }

  clientRequestsDataSecond:any;
  listClientRequestsSecond(item?:any, index?:any) {
    this.inventorySer.listClientRequests(item).subscribe((res:any)=> {
      console.log(res);
      this.clientRequestsDataSecond = res;
    })
  }

  showAdditionalFields: boolean = false;
  onClientRequestChange(value: string) {
    if (value === 'other') {
      this.showAdditionalFields = true;
    } 
    // else {
    //   this.showAdditionalFields = false;
    // }
  }



  form1() {
    this.userForm1 =  this.fb.group({
        'clientRequestId':new UntypedFormControl(null, Validators.required),
        'subTotal': new UntypedFormControl(null),
        'cgst':new UntypedFormControl(null),
        'sgst':new UntypedFormControl(null),
        'igst':new UntypedFormControl(null),
        'grandTotal': new UntypedFormControl(null),
        'cgstPercent': new UntypedFormControl(null),
        'sgstPercent': new UntypedFormControl(null),
        'igstPercent' : new UntypedFormControl(null),
       
      });

      // this.userForm1.get('igstPercent').valueChanges.subscribe((val: any) => {
      //   console.log(val)
      //   if(val !== null) {
      //     this.userForm1.get('cgstPercent').disable();
      //     this.userForm1.get('sgstPercent').disable();
      //   } else {
      //     this.userForm1.get('cgstPercent').enable();
      //     this.userForm1.get('sgstPercent').enable();
      //   }
      //   this.userForm1.get('sgstPercent').updateValueAndValidity();
      //   this.userForm1.get('cgstPercent').updateValueAndValidity();
      // });

    }

    sgst:any
    
    updateVal() {
      let cgst = this.userForm1.get('cgstPercent').value;
      let sgst = this.userForm1.get('sgstPercent').value;
      let igst = this.userForm1.get('igstPercent').value;

      if(cgst != null || sgst != null) {
        this.userForm1.get('igstPercent').disable();
      } else {
        this.userForm1.get('cgstPercent').enable();
        this.userForm1.get('sgstPercent').enable();
      }

      if(igst != null) {
        this.userForm1.get('cgstPercent').disable();
        this.userForm1.get('sgstPercent').disable();
      } else {
        this.userForm1.get('cgstPercent').enable();
        this.userForm1.get('sgstPercent').enable();
      }

    }

    onSaleTypeChange() {
      this.userForm1.get('igstPercent').enable();
      this.userForm1.get('cgstPercent').enable();
      this.userForm1.get('sgstPercent').enable();
      this.userForm1.reset()
      this.tasks = [];
    }
    
  form2() {
    this.userForm2=  this.fb.group({
        'itemCode': new UntypedFormControl('', Validators.required),
        'color': new UntypedFormControl({ value: '', disabled: true }, Validators.required),
        'colorCode': new UntypedFormControl({ value: '', disabled: true }, Validators.required),
        'quality': new UntypedFormControl({ value: '', disabled: true }, Validators.required),
        'soldCost': new UntypedFormControl(''),
        'cost': new UntypedFormControl({ value: '', disabled: true }, Validators.required),
        'quantity':new UntypedFormControl('', Validators.required),
        'amount' : new UntypedFormControl(null),
        
      });

      this.userForm2.get('itemCode').valueChanges.subscribe((itemCode:any) => {
        if (itemCode) {
          this.resetAndEnableControls();
          this.updateDependentOptions(itemCode);
        } else {
          this.disableControls();
        }
      });
    }

    form3() {
      this.userForm3 =  this.fb.group({
          'customerName':new UntypedFormControl(''),
          'emailId': new UntypedFormControl(''),
          'mobileNumber':new UntypedFormControl(''),
          'country':new UntypedFormControl(''),
          'state':new UntypedFormControl(''),
          'soldCost': new UntypedFormControl(''),
        });
      }


      resetAndEnableControls() {
        ['quality', 'color', 'colorCode', 'quantity', 'cost'].forEach(control => {
          this.userForm2.get(control).reset();
          this.userForm2.get(control).enable();
        });
      }
    
      disableControls() {
        ['quality', 'color', 'colorCode', 'quantity', 'cost'].forEach(control => {
          this.userForm2.get(control).disable();
        });
      }
    
      updateDependentOptions(itemCode: any) {
        this.statusItems = this.getStatusItemsForRaw(itemCode);
      }
    
      getStatusItemsForRaw(itemCode: any) {
        // Fetch or filter the items based on the itemCode
        // This is a placeholder function. Implement the actual logic to get the items.
        return []; // Return the filtered items based on itemCode
      }
    

  saleType: any = 1;
  sendingQuantity:any;
  currentItem1:any
  tasks: any = [];
  add(item: any) {
    let totalAount = item.cost * item.quantity
    item.amount = totalAount;
    if(this.userForm2.valid) {
      if(this.sendingQuantity > this.currentItem?.instock || 0) {
        this.alertSer.error('Enter Valid Quantity')
        return;
      }
        let itemExists = false;
        for (const val of this.tasks) {
          if (val.itemCode === item.itemCode) {
            this.alertSer.error('Already Exists! Remove and Retry.');
            itemExists = true;
            this.userForm2.reset();
            break;
          }
        }
        if (!itemExists) {
          this.tasks.push(item);
          this.calculateTotalCost();
          this.userForm2.reset();
        }

        this.calculate()
    }
    else {
      this.alertSer.error('Please add at least one item');
    }
  } 


  grandTotalWithCGSTSGST:any
  grandTotalWithIGST:any
  invoiceNumber:any;
  calculate() {
    let cgstPercent = this.userForm1.value.cgstPercent;
    let sgstPercent = this.userForm1.value.sgstPercent;
    let igstPercent = this.userForm1.value.igstPercent;

    let cgstFor = (cgstPercent)/100 * this.totalCost;
    let sgstFor = (sgstPercent)/100 * this.totalCost;
    let igstFor = (igstPercent)/100 * this.totalCost;
  
    this.grandTotalWithCGSTSGST  = this.totalCost + cgstFor + sgstFor;
    this.grandTotalWithIGST  = this.totalCost + igstFor;

    let userFormOne = this.userForm1.value;
    let userFormThree = this.userForm3.value;

    if(this.saleType == 1) {
      if(this.userForm1.value.cgstPercent && this.userForm1.value.sgstPercent) {
        userFormOne.grandTotal = Math.round(this.grandTotalWithCGSTSGST);
      } else {        
        userFormOne.grandTotal = Math.round(this.grandTotalWithIGST);
      }
        userFormOne.subTotal = this.totalCost;
        userFormOne.sgst = sgstFor;
        userFormOne.cgst = cgstFor;
        userFormOne.igst = igstFor
        userFormOne.cgstPercent = cgstPercent
        userFormOne.sgstPercent = sgstPercent
        userFormOne.igstPercent = igstPercent
        // userFormOne.subTotal = this.totalCost

    } else if(this.saleType == 2) {
      if(this.userForm1.value.cgstPercent && this.userForm1.value.sgstPercent) {
        userFormOne.grandTotal = Math.round(this.grandTotalWithCGSTSGST);
      } else {        
        userFormOne.grandTotal = Math.round(this.grandTotalWithIGST)
      }

        userFormOne.subTotal = this.totalCost;
        userFormOne.sgst = sgstFor;
        userFormOne.cgst = cgstFor;
        userFormOne.subTotal = this.totalCost
        userFormOne.igst = igstFor
      
    }

    if(this.saleType == 2) {
      delete userFormOne.clientRequestId;
      userFormThree.customerName = userFormThree.customerName;
      userFormThree.mobileNumber = userFormThree.mobileNumber;
      userFormThree.emailId = userFormThree.emailId;
      userFormThree.state = userFormThree.state;
    }
  }

  // calculate() {
  //   let cgstPercent = this.userForm1.value.cgstPercent;
  //   let sgstPercent = this.userForm1.value.sgstPercent;
  //   let igstPercent = this.userForm1.value.igstPercent;

  //   let cgstFor = (cgstPercent)/100 * this.totalCost;
  //   let sgstFor = (sgstPercent/100) * this.totalCost;
  //   let igstFor = (igstPercent/100) * this.totalCost;
  
  //   this.grandTotalWithCGSTSGST  = this.totalCost + cgstFor + sgstFor;
  //   this.grandTotalWithIGST  = this.totalCost + igstFor;

  //   let userFormOne = this.userForm1.value;
  //   let userFormThree = this.userForm3.value;

  //   if(this.saleType == 1) {
  //     if(this.clientRequestsDataSecond.country == 'India' && this.clientRequestsDataSecond.state == 'Andhra Pradesh') {
  //       userFormOne.grandTotal = this.grandTotalWithCGSTSGST;
  //       userFormOne.subTotal = this.totalCost;
  //       userFormOne.sgst = sgstFor;
  //       userFormOne.cgst = cgstFor;
  //       userFormOne.cgstPercent = cgstPercent
  //       userFormOne.sgstPercent = sgstPercent
  //       userFormOne.igstPercent = igstPercent
  //       } else {
  //         userFormOne.subTotal = this.totalCost
  //         userFormOne.grandTotal = this.grandTotalWithIGST
  //         userFormOne.igst = igstFor
  //         userFormOne.igstPercent = igstPercent
  //     }
  //   } else {
  //     if(this.userForm3.value.country !== 'India' && this.userForm3.value.state !== 'Andhra Pradesh') {
  //       userFormOne.grandTotal = this.grandTotalWithCGSTSGST;
  //       userFormOne.subTotal = this.totalCost;
  //       userFormOne.sgst = sgstFor;
  //       userFormOne.cgst = cgstFor;
  //       } else {
  //         userFormOne.subTotal = this.totalCost
  //         userFormOne.grandTotal = this.grandTotalWithIGST
  //         userFormOne.igst = igstFor
  //     }
  //   }

  //   if(this.saleType == 2) {
  //     delete userFormOne.clientRequestId;
  //     userFormThree.customerName = userFormThree.customerName;
  //     userFormThree.mobileNumber = userFormThree.mobileNumber;
  //     userFormThree.emailId = userFormThree.emailId;
  //     userFormThree.state = userFormThree.state;
  //   }
  // }

  submit() {
    this.inventorySer.CreateInvoice(this.userForm1.value, this.tasks, this.saleType == 2 ? this.userForm3.value : null).subscribe((res: any) => {
      this.invoiceNumber= res.invoiceNo;
      this.inventorySer.invoiceNoSub.next(res.invoiceNo);
      this.newItemEvent.emit();
      if(this.tasks.length != 0 )  {
        this.dialog.open(TaxInvoiceComponent);
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err?.error?.message);
      };
    })
  }
    


  invoicedata: any = [];
  listInvoices(payload:any) {
    this.inventorySer.listInvoices({invoiceNo:payload}).subscribe((res: any) => {
      console.log(res);
      this.invoicedata = res;
      this.dialog.open(TaxInvoiceComponent)

    });
  }

  // open() {
  //     this.dialog.open(TaxInvoiceComponent, {
  //       autoFocus: false,
  //       restoreFocus: false,
  //       height:'100vh',
  //       // width:'47vw'
  //     })
  //     this.newItemEvent.emit();
  // }
  
  siteId:any
  siteSearch: any;
  searchSites(event: any) {
    this.siteSearch = (event.target as HTMLInputElement).value;
  }

  delete(index:any) {
    this.tasks.splice(index , 1)
    this.calculateTotalCost();
  }
  
  productMaster: any = [];
  newProductMaster: any = [];
  active: any = [];

  vendorDetail: any;
  listProduct() {
    this.inventorySer.listProduct().subscribe((res: any) => {
      // console.log(res);
      this.productMaster = res;
      this.newProductMaster = this.productMaster;
      for(let item of this.productMaster) {
        if(item.statusId == 1) {
          this.active.push(item);
        }
      }
    });
  }

  getProductPrice(product: any): number {
    return 10;
  }

  currentItem:any
  statusItems:any = [];
  openStatusItems(item:any) {
    console.log(item);
    this.currentItem = item
    // console.log(this.userForm.value);
      this.inventorySer.listInventoryForSending({itemCode:this.userForm2.value.itemCode,
        color:this.userForm2.value.color,
        colorCode:this.userForm2.value.colorCode,
        cost:this.userForm2.value.cost,
        quality:this.userForm2.value.quality
      }).subscribe((res: any) => {
        console.log(res);
        this.statusItems = res;
        // console.log(this.statusItems);
      })
    }

    totalCost: any;
    calculateTotalCost(): void {
      this.totalCost = this.tasks.reduce((acc: any, curr: any) => acc + (curr.soldCost * curr.quantity), 0 ) ;
    }
    
  isShown: boolean = false;
  toggleShowOnOff() {
    this.isShown = !this.isShown;
  }

  close() {
    this.newItemEvent.emit();
  }

  /* metadata methods */
  deviceType: any;
  deviceMode: any;
  workingDay: any;
  tempRange: any;
  ageRange: any;
  modelObjectType: any;
  model: any;
  modelResolution: any;
  softwareVersion: any;
  weatherInterval: any;
  deviceStatus: any
  getMetadata() {
    this.dropDown.getMetadata().subscribe((res: any) => {
      for(let item of res) {
        if(item.type == 'Device_Type') {
          this.deviceType = item.metadata;
        }
        else if(item.type == 'Device_Mode') {
          this.deviceMode = item.metadata;
        }
        else if(item.type == 'Working_Day') {
          this.workingDay = item.metadata;
        }
        else if(item.type == 'Ads_Temp_Range') {
          this.tempRange = item.metadata;
        }
        else if(item.type == 'Ads_Age_Range') {
          this.ageRange = item.metadata;
        }
        else if(item.type == 'model_object_type') {
          this.modelObjectType = item.metadata;
        }
        else if(item.type == 'Model') {
          this.model = item.metadata;
        }
        else if(item.type == 'Model Resolution') {
          this.modelResolution = item.metadata;
        }
        else if(item.type == 'Ads_Software_Version') {
          this.softwareVersion = item.metadata;
        }
        else if(item.type == 'Weather_Interval') {
          this.weatherInterval = item.metadata;
        }
        else if(item.type == 'Device_Status') {
          this.deviceStatus = item.metadata;
        }
      }
    })
  }

  /* create device */
  toAddDevice: any;
  isToogleClicked: boolean = false;
  onToAddDevice(e: any) {
    this.isToogleClicked = true;
    this.toAddDevice = e.value.length;
    // console.log(e.value.length)
  }

}
function ViewChild(arg0: string): (target: AddNewCustomerComponent, propertyKey: "printable") => void {
  throw new Error('Function not implemented.');
}

