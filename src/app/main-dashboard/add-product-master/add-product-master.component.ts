import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/services/alert.service';
import { InventoryService } from 'src/services/inventory.service';
import { MetadataService } from 'src/services/metadata.service';


@Component({
  selector: 'app-add-product-master',
  templateUrl: './add-product-master.component.html',
  styleUrls: ['./add-product-master.component.css'],
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
export class AddProductMasterComponent implements OnInit {

  constructor(
    private inventorySer: InventoryService,
    private router: Router,
    private fb: UntypedFormBuilder,
    private metadataSer: MetadataService,
    public alertSer: AlertService,

  ) { }

  @Input() show:any;

  @Output() newItemEvent = new EventEmitter<boolean>();

  @Output() newUser = new EventEmitter<any>();

  UserForm: any =  UntypedFormGroup;

  prductMasterObj = {
    itemName: null,
    itemType: null,
    itemUom: null,
    description: null,
    remarks: null,
    productionPrice:null,
    sellingPrice:null
  }

  

  ngOnInit() {
    this.UserForm = this.fb.group({
      'productionPrice': new UntypedFormControl(''),
      'description': new UntypedFormControl(''),
      'sellingPrice': new UntypedFormControl(''),
      'remarks': new UntypedFormControl(''),
      'itemName': new UntypedFormControl('', Validators.required),
      'itemType': new UntypedFormControl('' , Validators.required),
      'itemUom': new UntypedFormControl('' , Validators.required),
      
    });
    this.getMetadata();
  }
  /* metadata filter */
  itemType: any;
  uomItem: any;
  quality:any;
  getMetadata() {
    let data = JSON.parse(localStorage.getItem('metaData')!);
    data?.forEach((item: any) => {
      if(item.type === 50) {
        this.itemType= item.metadata;
      } else if(item.type === 49) {
        this.uomItem = item.metadata;
      } else if(item.type === 54) {
        this.quality = item.metadata;
      }
    })
  }

  closeAddUser() {
    this.newItemEvent.emit();
  }
  vendorDetail: any;
  getVendor() {
    this.inventorySer.listVendors().subscribe((res: any) => {
      this.vendorDetail = res;
    })
  }

  submit() {
    if(this.UserForm.valid) {
      this.alertSer.wait();
      this.inventorySer.createProduct(this.UserForm.value).subscribe((res: any) => {
        this.newItemEvent.emit();
        this.alertSer.success(res?.message);
      }, (err: any) => {
        if(err) {
          this.alertSer.error(err?.error?.message);
        };
      })
    }
  }


  checkbox: boolean = false;
  onCheck() {
    this.checkbox = !this.checkbox;
  }


  internet: boolean = false;

  // toggleShowInternet(value: any, type: any) {
  //   if (type == 'internet') {
  //     if (value == 'on') {
  //       this.internet = true;
  //     }
  //     else {
  //       this.internet = false;
  //     }
  //   }
  // }



  // existSecuity: boolean = false;

  // toggleShowExistSecuity(value: any, type: any) {
  //   if (type == 'security') {
  //     if (value == 'on') {
  //       this.existSecuity = true;
  //     }
  //     else {
  //       this.existSecuity = false;
  //     }
  //   }
  // }


  isShown: boolean = false; // hidden by default

  toggleShowOnOff() {
    this.isShown = !this.isShown;
  }

  isShownForSecond: boolean = false; // hidden by default

  toggleShowOnOffForSecond() {
    this.isShownForSecond = !this.isShownForSecond;
  }

}
function itemNameValidator(existingItems: any): import("@angular/forms").ValidatorFn | import("@angular/forms").ValidatorFn[] | import("@angular/forms").AbstractControlOptions | null | undefined {
  throw new Error('Function not implemented.');
}

