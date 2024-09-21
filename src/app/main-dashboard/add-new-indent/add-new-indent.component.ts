import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe, formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { color } from 'highcharts';
import { AlertService } from 'src/services/alert.service';
import { InventoryService } from 'src/services/inventory.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-add-new-indent',
  templateUrl: './add-new-indent.component.html',
  styleUrls: ['./add-new-indent.component.css'],
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
export class AddNewIndentComponent implements OnInit {
  constructor(
    private inventorySer: InventoryService,
    private router: Router,
    private fb: UntypedFormBuilder,
    public alertSer: AlertService,
    public datepipe: DatePipe,
    private storageSer: StorageService
  ) { }

  @Input() show: any;
  @Input() data: any;
  @Output() newItemEvent = new EventEmitter<boolean>();

  UserForm1: any =  UntypedFormGroup;
  UserForm2: any =  UntypedFormGroup;



  user: any;
  ngOnInit() {
    console.log(this.show)
    this.form1();
    this.form2();
    
    // this.listInventory();
    // this.getVendor();
    this.getProducts();
    this.listProduct()
    this.listMachineAssignmentFirst()
    this.user =   JSON.parse(localStorage.getItem('user')!);
  }
  

  form1() {
    this.UserForm1 = this.fb.group({
      
      'weaverId': new UntypedFormControl(''),
      'weaverName': new UntypedFormControl('', Validators.required),
      'machineNoAliasInventoryId': new UntypedFormControl(''),
      'crdId': new UntypedFormControl(''),
      'expectedDate':new UntypedFormControl(''),
      'sareeCount': new UntypedFormControl('5', Validators.required),
    })
  }
  
  form2() {
    this.UserForm2 = this.fb.group({
      'itemCode':new UntypedFormControl('', Validators.required),
      
      'quality':new UntypedFormControl( { value: '', disabled: true }, Validators.required),
      'color':new UntypedFormControl( { value: '', disabled: true }, Validators.required),
      'colorCode':new UntypedFormControl({ value: '', disabled: true }, Validators.required),
      'quantity':new UntypedFormControl({ value: '', disabled: true }, Validators.required),
      'cost':new UntypedFormControl({ value: '', disabled: true }, Validators.required),
      'issuedDate': new UntypedFormControl('', Validators.required)
    })

    this.UserForm2.get('itemCode').valueChanges.subscribe((itemCode:any) => {
      if (itemCode) {
        this.resetAndEnableControls();
        this.updateDependentOptions(itemCode);
      } else {
        this.disableControls();
      }
    });

    
  }

  resetAndEnableControls() {
    ['quality', 'color', 'colorCode', 'quantity', 'cost'].forEach(control => {
      this.UserForm2.get(control).reset();
      this.UserForm2.get(control).enable();
    });
  }

  disableControls() {
    ['quality', 'color', 'colorCode', 'quantity', 'cost'].forEach(control => {
      this.UserForm2.get(control).disable();
    });
  }

  updateDependentOptions(itemCode: any) {
    this.statusItemsForRaw = this.getStatusItemsForRaw(itemCode);
  }

  getStatusItemsForRaw(itemCode: any) {
    // Fetch or filter the items based on the itemCode
    // This is a placeholder function. Implement the actual logic to get the items.
    return []; // Return the filtered items based on itemCode
  }



  sendingQuantity:any
  tasks: any = [];
//   add(item: any) {
// if(this.sendingQuantity > this.currentItem?.quantity) {
//   this.alertSer.error('enter Valid Quantity')
// } else {
//   if(this.UserForm2.valid) {
//     this.UserForm2.value.issuedDate = formatDate(this.UserForm2.value.issuedDate, 'yyyy-MM-dd hh:mm:ss','en-us')
//     if(this.tasks.length > 0) {
//       this.tasks.forEach((val: any) => {
//         if(val.itemCode === item.itemCode) {
//           this.alertSer.error('Already Exists! Remove and Retry.')
//         }  else {
//           this.tasks.push(item);
//         } 
//       })
//     } 
//       else {
//       this.tasks.push(item);
//       this.UserForm2.reset()
//     }
//   } 
//   else {
//     this.alertSer.error('Please add atleast one item')
//   }
// }
 
//   }

  add(item: any) {
    // console.log(item);
    // this.UserForm2.get('quantity').valueChanges.subscribe((val: any) => {
    //   console.log(val)
    //   if(val > 5) {
    //     this.UserForm2.get('quantity').setValidators(Validators.required);
    //   } else {
    //     this.UserForm2.get('quantity').clearValidators();
    //   }
    //   this.UserForm2.get('quantity').updateValueAndValidity();
    // });
//     let timestamp: string = "2024-04-03T18:30:00.000Z";
//  let timeWithoutMs: string;
//     timeWithoutMs = timestamp.slice(0, -5);

  // if(this.UserForm2.valid) {
  //   this.UserForm2.value.issuedDate = formatDate(this.UserForm2.value.issuedDate, 'yyyy-MM-dd hh:mm:ss','en-us')
  //   if(this.sendingQuantity > this.currentItem?.quantity) {
  //     this.alertSer.error('enter Valid Quantity')
  //   } else
  //   if(this.tasks.length > 0) {
  //     this.tasks.forEach((val: any) => {
  //       if(val.itemCode === item.itemCode) {
  //         this.alertSer.error('Already Exists! Remove and Retry.')
  //       }  else {
  //         this.tasks.push(item);
  //         this.UserForm2.reset()
  //       } 
  //     })
  //   } 
  //     else {
  //     this.tasks.push(item);
  //     this.UserForm2.reset()
  //   }
  // }
  // else {
  //   this.alertSer.error('Please add atleast one item')
  // } 


  if(this.UserForm2.valid) {
    this.UserForm2.value.issuedDate = formatDate(this.UserForm2.value.issuedDate, 'yyyy-MM-dd', 'en-us');

    let itemExists = false;
    for (const val of this.tasks) {
      if (val.itemCode === item.itemCode) {
        this.alertSer.error('Already Exists! Remove and Retry.');
        itemExists = true;
        this.UserForm2.reset();
        break;
      }
    }

    if (!itemExists) {
      if (this.sendingQuantity > (this.total_quantity_after_issue)) {
        this.alertSer.error('Enter Valid Quantity');
        } else {
        // if(this.statusItemsForRaw[0].itemUom === 4) {
        //   item.quantity = item.quantity * 1000
        // } 
        this.tasks.push(item);
        this.UserForm2.reset();
      }
    }
  } else {
    this.alertSer.error('Please add at least one item');
  }

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

  statusItems:any = [];
  openStatusItems(item:any) {
    // console.log(item)
      this.inventorySer.listInventoryForSending(this.UserForm2.value).subscribe((res: any) => {
        // console.log(res);
        this.statusItems = res;
      })
    }

    total_quantity_after_issue: any;
    currentItem: any
    statusItemsForRaw: any = []
    ViewInvRawMaterials(item:any) {
      this.currentItem = item
      this.inventorySer.ViewInvRawMaterials({itemCode: this.UserForm2.value.itemCode , 
        color:this.UserForm2.value.color,
        colorCode:this.UserForm2.value.colorCode,
        quality:this.UserForm2.value.quality,
        cost:this.UserForm2.value.cost}).subscribe((res: any) => {
        console.log(res);
        this.statusItemsForRaw = res;
        this.total_quantity_after_issue = this.statusItemsForRaw.reduce((acc:any, curr: any) => {
          return  acc + curr.quantityAfterIssue
        }, 0) 
      })
    }

    machine = {
      weaverId: null,
      weaverName:null ,
      machineNoAliasInventoryId: null
    }

    invenData:any = []
    listMachineAssignmentFirst() {
      this.inventorySer.listMachineAssignment().subscribe((res:any)=> {
        // console.log(res);
        this.invenData = res
      })
    }

    indentTable:any = []
    listMachineAssignment(item?:any,index?:any) {
      console.log(item)
      this.inventorySer.listMachineAssignment(item).subscribe((res:any)=> {
        console.log(res);
        this.indentTable = res;
      
        this.machine.weaverId = res[0]?.weaverId,
        console.log( this.machine.weaverId)
        this.machine.machineNoAliasInventoryId = res[0]?.machineNoAliasInventoryId
      })
    }
    
  
  inventoryTable:any;
  listInventory() {
    this.inventorySer.listInventory().subscribe((res: any) => {
      // console.log(res);
      this.inventoryTable = res;
    });
  }

  submit() {
    if(this.UserForm1.valid) {
      let weaverId = this.UserForm1.value.weaverId;
      let machineNoAliasInventoryId = this.UserForm1.value.machineNoAliasInventoryId;
      // if(this.indentTable.length !== 0) {
      //   weaverId = this.indentTable[0]?.weaverId;
      //   machineNoAliasInventoryId = this.indentTable[0]?.machineNoAliasInventoryId;
      // }

      this.UserForm1.value.expectedDate = formatDate(this.UserForm1.value.expectedDate, 'yyyy-MM-dd', 'en-us');
      this.UserForm1.value.crdId = this.data.id;
        this.inventorySer.assignMachineAndItems(this.UserForm1.value, this.tasks).subscribe((res: any) => {
          // if(this.UserForm2.value.quality > this.currentItem?.quantity) {
          //   this.alertSer.error(res?.message)
          // }
          this.newItemEvent.emit();
          this.alertSer.success(res?.message);
        },
        (err: any) => {
          this.alertSer.error(err?.error?.message);
        } 
      );
      
    } 
  }


  searchText:any

  searchFunction(event:any) {
    this.searchText = (event.target as HTMLInputElement).value
  }

  // suData:any=[];
  // data:any = [];
  // startsWithCo:any = [];
  // inventoryData: any;
  // listInventoryFirst() {
  //   this.inventorySer.listInventoryFirst().subscribe((res: any) => {
  //     console.log(res)
  //     this.inventoryData = res;
  //     this.inventoryData.forEach((obj: any)=> {
  //       if(obj.itemCode.startsWith("Co") && obj.statusId == 1) {
  //         this.startsWithCo.push(obj);

  //         console.log(this.startsWithCo);
  //       } 
  //       if(obj.itemCode.startsWith("Su") && obj.statusId == 1) {
  //         this.suData.push(obj);
  //         console.log(this.startsWithCo);
  //       } 
  //       else {
  //       this.data.push(obj)
  //       console.log(this.data)
  //       }
  //     })
  //   })
  // }

  productIds: any;
  getProducts() {
    this.inventorySer.listProduct().subscribe((res: any) => {
      this.productIds = res;
    })
  }
  closeIndent() {
    this.newItemEvent.emit();
  }
  checkbox: boolean = false;
  onCheck() {
    this.checkbox = !this.checkbox;
  }
  deleteTableItem(index: any) {
    console.log(index)
    this.tasks.splice(index, 1)
  }
}
