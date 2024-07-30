import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { InventoryService } from 'src/services/inventory.service';
import { MetadataService } from 'src/services/metadata.service';
import { StorageService } from 'src/services/storage.service';


@Component({
  selector: 'app-add-new-camera',
  templateUrl: './add-new-camera.component.html',
  styleUrls: ['./add-new-camera.component.css'],
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
export class AddNewCameraComponent implements OnInit {

  constructor(
    private router: Router,
    private inventorySer: InventoryService,
    private fb: UntypedFormBuilder,
    private metadataSer: MetadataService,
    public alertSer: AlertService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private storageSer: StorageService,
    private metaDataSer: MetadataService
  ) { }

  @Input() show:any;

  @Output() newItemEvent = new EventEmitter<any>();

  // @Output() newUser = new EventEmitter<any>();

  // @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
  //   var x = <HTMLElement>document.getElementById(`user`);
  //   if (x != null) {
  //     if (!x.contains(e.target)) {
  //       this.closeAddUser(false);
  //     }
  //   }
  // }
  // error=false;

  isShown: boolean = false;
  toggleShowOnOff() {
    this.isShown = !this.isShown;
    // this.isShown = true;
  }

  UserForm: any =  UntypedFormGroup;
  UserForm1:any = UntypedFormGroup;

  productData: any;
  orderIds: any;
  user: any;
  ngOnInit() {
    this.form1();
    this.form2();
    this.getVendor();
    this.listProduct();
    this.user =   JSON.parse(localStorage.getItem('user')!);
  }

  quantityUnits: any = 1;
  form1() {
    this.UserForm = this.fb.group({
      'itemCode': new UntypedFormControl('', Validators.required),
      'quality': new UntypedFormControl('', Validators.required),
      'color': new UntypedFormControl('', Validators.required),
      'colorCode': new UntypedFormControl('', Validators.required),
      'price': new UntypedFormControl('', Validators.required),
      'cost': new UntypedFormControl('', Validators.required),
      'quantity': new UntypedFormControl('', Validators.required)
      // 'image':new FormControl('',Validators.required)
    });
  }
  form2() {
    this.UserForm1 = this.fb.group({
      'itemCode': new UntypedFormControl('', Validators.required),
      'quality': new UntypedFormControl('', Validators.required),
      'color': new UntypedFormControl('', Validators.required),
      'colorCode': new UntypedFormControl('', Validators.required),
      'invoiceNumber': new UntypedFormControl('', Validators.required),
      'invoiceDate': new UntypedFormControl('', Validators.required),
      'cost': new UntypedFormControl('', Validators.required),
      'quantity': new UntypedFormControl('', Validators.required),
      'quantityIn': new UntypedFormControl(4, Validators.required),
      'vendorId':new UntypedFormControl('',Validators.required)
    });
  }

  listProduct() {
    this.inventorySer.listProduct().subscribe((res: any) => {
      this.getMetadata();
      this.productData = res;
      // console.log(this.productData);
    })

    // this.inventorySer.listOrders().subscribe((res: any) => {
    //   this.orderIds = res;
    // })
  }
  tasks: any = [];
  add(item: any) {
    // console.log(item)
    if(this.UserForm.valid) {
      // this.alertSer.wait();
      // this.inventorySer.uploadFile(this.selectedFile).subscribe((res:any)=> {
      //   console.log(res);
      //   this.alertSer.success('Success');
      // })
      this.tasks.push(item);
      // this.tasks.forEach((val: any) => {
      //   val.image = null
      // })
      this.UserForm.reset();
    } else {
      this.alertSer.error('Please fill all fields');
    }
  }

  tasks1: any = [];
  add1(item: any) {
    let finalQty = this.UserForm1.value.quantityIn;
    let qty = this.UserForm1.value.quantity;
    if(finalQty === 4) {
      finalQty = Math.ceil(qty * 1000);
    } else {
      finalQty = qty;
    }
    item.quantity = finalQty;
    if(this.UserForm1.valid) {
      this.tasks1.push(item);
      this.UserForm1.reset();
    } else {
      this.alertSer.error('Please fill all fields');
    }
  }

  submit() {
    if(this.tasks.length !== 0) {
      // console.log(this.tasks);
      // this.inventoryBody.createdBy = this.user?.UserId
  
      this.tasks.forEach((el:any)=> {
        el.createdBy =this.user?.UserId
      })
      this.inventorySer.createInventory(this.tasks).subscribe((res: any) => {
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

  

  vendorDetail: any;
  getVendor() {
    this.inventorySer.listVendors().subscribe((res: any) => {
      this.vendorDetail = res;
    })
  }


  brandNames: any = [];
  listInventoryByItemCode(data: any) {
    this.inventorySer.listInventoryByItemCode(data).subscribe((res: any) => {
      this.brandNames = res;
    })
  }

  modelNames: any;
  listBrandAndModel(data: any) {
    // console.log(data)
    // this.inventorySer.listBrandAndModel(data).subscribe((res: any) => {
    //   console.log(res);
    //   this.modelNames = res?.brand;
    // })

    this.modelNames = data
  }

//   submit() {
//     if(this.UserForm.valid) {
//       this.alertSer.wait();
//     this.metaDataSer.uploadFile({file: this.selectedFiles[0],fileName:this.selectedFiles[0]?.name}).subscribe((res:any)=> {
//         // console.log(res);
//         this.inventoryBody.image = res.assetName;
//       this.inventoryBody.createdBy = this.user?.UserId;
//       this.inventoryBody = this.inventoryBody
//       this.inventorySer.createInventory(this.inventoryBody).subscribe((res: any) => {
//         // console.log(res);
//         this.newItemEvent.emit();
//         this.alertSer.success(res?.message);
//       });
//     })
// }
// }

Weavers_Item_Uom:any
  partType: any;
  partCategory: any;
  partCode: any;
  buildType: any;
  Weavers_Quality:any
  getMetadata() {
    this.metadataSer.getMetadata().subscribe((res: any) => {
      for(let item of res) {
        if(item.type == 54) {
          this.Weavers_Quality = item.metadata;
        } else if(item.type == 49) {
          this.Weavers_Item_Uom = item.metadata;
        } else if(item.type == 'part_code') {
          this.partCode = item.metadata;
        } else if(item.type == 'build_type') {
          this.buildType = item.metadata;
        }
      }
    })
  }

  closeAddUser() {
    this.newItemEvent.emit();
  }

  openAnotherForm(newform:any) {
    this.newItemEvent.emit();
    localStorage.setItem('opennewform', newform)
  }

  submitted!: boolean;
  arr: any = [];
  warrantyDetail: any = 'N';
  // submit() {
  //   this.inventoryBody.itemCode = this.inventoryBody.itemCode;
  //   if(this.UserForm.valid) {
  //     this.alertSer.wait();
  //     this.inventoryBody.createdBy = this.user?.UserId;
  //     this.inventoryBody.warranty.createdBy = this.user?.UserId;
  //     // if(this.inventoryBody.serialnos == '') {
  //     //   this.inventoryBody.serialnos = this.arr;
  //     // } else {
  //     //   // this.inventoryBody.serialnos = this.inventoryBody.serialnos?.split(',').map((value: any) => value.trim());
  //     //   this.arr.push(this.inventoryBody.serialnos?.split(',').map((value: any) => value.trim()));
  //     //   this.inventoryBody.serialnos = this.arr[0];
  //     // }
  //     this.inventoryBody.warranty.startDate = this.datepipe.transform(this.inventoryBody.warranty.startDate, 'yyyy-MM-dd');
  //     this.inventoryBody.warranty.endDate = this.datepipe.transform(this.inventoryBody.warranty.endDate, 'yyyy-MM-dd');

  //     this.inventorySer.createInventory(this.inventoryBody, this.warrantyDetail).subscribe((res: any) => {
  //       // console.log(res);
  //       this.newItemEvent.emit();
  //       this.alertSer.success(res?.message);
  //     }, (err: any) => {
  //       if(err) {
  //         this.alertSer.error(err?.error?.message);
  //       }
  //     });
  //   }
  //   // console.log(this.inventoryBody);
  // }

  checkbox: boolean = false;
  onCheck() {
    this.checkbox = !this.checkbox;
  }


  selectedFile: any;
  public onFileSelected(event: any): void {
    let file = FileList = event.target.files;
    // for(let i = 0; i < file.length; i++) {
    //   this.selectedFiles.push(file[i]);
    // }
    this.selectedFile = file[0];
    console.log(this.selectedFile)

  }


}
