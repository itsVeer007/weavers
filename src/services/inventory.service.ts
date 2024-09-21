import { DatePipe, formatDate } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
// import { format } from 'path';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {

invoiceNoSub: BehaviorSubject<any> = new BehaviorSubject(null)
purchaseSub: BehaviorSubject<any> = new BehaviorSubject(null)
goodRecieptSub: BehaviorSubject<any> = new BehaviorSubject(null)

  // baseUrl = `${environment.baseUrl}/weavers`;
  baseUrl = 'http://192.168.0.237:8080';

  constructor(
    private http: HttpClient,
    public datepipe: DatePipe,
    private storageSer: StorageService
  ) {}

  comment$: any = new BehaviorSubject(null);
  public itemNameSource = new BehaviorSubject<string>('');

  /* inventory */
  listItemCode(payload: any) {
    let url = this.baseUrl + '/listItemCode_1_0';
    let params = new HttpParams();

    if (payload.partType) {
      params = params.set('p_part_type', payload.partType);
    }
    if (payload.partCategory) {
      params = params.set('p_part_category', payload.partCategory);
    }
    if (payload.partCode) {
      params = params.set('p_part_code', payload.partCode);
    }
    if (payload.buildType) {
      params = params.set('p_build_type', payload.buildType);
    }

    return this.http.get(url, { params: params });
  }

  listBrandAndModel(payload: any) {
    let url = this.baseUrl + '/listBrandAndModel_1_0';
    let params = new HttpParams()
      .set('p_item_code', payload.itemCode)
      .set('p_brand', payload.brand);

    // if(payload.itemCode) {
    //   params = params.set('p_item_code', payload.itemCode)
    // }
    // if(payload.brand) {
    //   params = params.set('p_brand', payload.brand)
    // }

    return this.http.get(url, { params: params });
  }

  listInventory() {
    let url = this.baseUrl + `/listInventory_1_0`;
    let params = new HttpParams().set('startDate', '2024-02-01').set('end1_date', formatDate(new Date(), 'yyyy-MM-dd', 'en-us'));
    return this.http.get(url, { params: params });
  }

  listInventoryForRaw() {
    let url = this.baseUrl + `/listInventoryRawMaterials_1_0`;
    let params = new HttpParams().set('startDate', '2024-02-01').set('endDate', formatDate(new Date(), 'yyyy-MM-dd', 'en-us'));
    return this.http.get(url,  { params: params });
  }

  filterInventory(payload: any) {
    let url = this.baseUrl + `/listInventory_1_0`;
    let params = new HttpParams().set('startDate', formatDate(payload.startDate, 'yyyy-MM-dd', 'en-us')).set('end1_date', formatDate(payload.endDate, 'yyyy-MM-dd', 'en-us'));
    return this.http.get(url, { params: params });
  }
  filterForRaw(payload: any) {
    let url = this.baseUrl + `/listInventoryRawMaterials_1_0`;
    let params = new HttpParams().set('startDate', formatDate(payload.startDate, 'yyyy-MM-dd', 'en-us')).set('endDate', formatDate(payload.endDate, 'yyyy-MM-dd', 'en-us'));
    return this.http.get(url, { params: params });
  }
  listSareesPrices(payload:any) {
    let url = this.baseUrl + '/listSareesPrices_1_0';
    let params = new HttpParams();
    if(payload?.suggestedItemCode) {
      params = params.set('itemCode', payload.suggestedItemCode);
    }
    return this.http.get(url, { params: params });
  }


  listInventoryByItemCode(payload: any) {
    let url = this.baseUrl + `/listInventoryByItemCode_1_0`;
    let params = new HttpParams();
    if (payload.itemCode) {
      params = params.set('itemCode', payload.itemCode);
    }
    if (payload.colorCode) {
      params = params.set('colorCode', payload.colorCode);
    }
    if (payload.color) {
      params = params.set('color', payload.color);
    }
    if (payload.quality) {
      params = params.set('quality', payload.quality);
    }
    if (payload.price) {
      params = params.set('price', payload.price);
    }
    if (payload.cost) {
      params = params.set('cost', payload.cost);
    }
    return this.http.get(url, { params: params });
  }
  listInventoryByProductId(productId: any) {
    let url =
      this.baseUrl + `/listInventoryByProductId_1_0?productId=${productId}`;
    return this.http.get(url);
  }

  listDetails(payload: any) {
    let url = this.baseUrl + `/listDetails12`;
    let params = new HttpParams()
      .set('t_item_code', payload.itemCode)
      .set('status_id', 4);
    return this.http.get(url, { params: params });
  }

  listDetailsByStatus(payload: any) {
    let url = this.baseUrl + `/listDetails12`;
    let params = new HttpParams().set('status_id', payload);
    return this.http.get(url, { params: params });
  }

  // createInventory(payload: any, condition: any) {
  //   let url = this.baseUrl + '/createInventoryAndWarranty_1_0';
  //   let payload1;
  //   let payload2;
  //   let payload3;
  //   let payload4;

  //   if(condition == 'Y') {
  //     payload1 = payload?.inventory,
  //     payload2 = payload?.serialnos,
  //     payload3 = payload?.quantity,
  //     payload4 = payload?.warranty
  //   } else {
  //     payload1 = payload?.inventory,
  //     payload2 = payload?.serialnos,
  //     payload3 = payload?.quantity
  //   }
  //   const requestBody = {
  //     'inventory': payload1,
  //     'serialnos': payload2,
  //     'quantity': payload3,
  //     'warranty': payload4
  //   };

  //   return this.http.post(url, requestBody)
  // }

  itemType: any;
  uomItem: any;
  quality:any;
  weaverStatus: any;
  getMetadata() {
    let data = JSON.parse(localStorage.getItem('metaData')!);
    // console.log(data)
    for(let item of data) {
      if(item.type === 50) {
        this.itemType= item.metadata;
      } else if(item.type === 49) {
        this.uomItem = item.metadata;
      } else if(item.type === 54) {
        this.quality = item.metadata;
      } else if(item.type === 48) {
        this.weaverStatus = item.metadata;
      }
    }
  }

  uploadFile(payload:any) {
    let url = 'http://192.168.0.192:8081/uploadFile_1_0';
    let formData = new FormData()
    formData.append('assetFile', payload)
    // console.log(payload)
    formData.append('requestName','av_assets')
    formData.append('assetName', payload?.name)
    return this.http.post(url, formData);
  }

  createInventory(tasks: any) {
    let url = this.baseUrl + '/createInventory_1_0';
    return this.http.post(url, tasks);
  }

  createInventoryRawMaterials(tasks1: any, payload:any) {
    let user = JSON.parse(localStorage.getItem('user')!);
    let url = this.baseUrl + '/createInventoryRawMaterials_1_0';
    let myObj = {
        goodReceiptNote:{
          sgst: payload.sgst,
          cgst: payload.cgst,
          igst: payload.igst
      }, 
      inventoryRawMaterials: tasks1
    }

    return this.http.post(url, myObj);
  }

  createPurchaseOrder(tasks1: any, payload1:any) {
    let user = JSON.parse(localStorage.getItem('user')!);
    let url = this.baseUrl + '/createPurchaseOrder_1_0';
    let myObj = {
      po:{
        vendorId:payload1.vendorId,
        subTotal:payload1.subTotal,

        igstPercent:payload1.igstPercent,
        sgstPercent:payload1.sgstPercent,
        cgstPercent:payload1.cgstPercent,

        cgst:payload1.cgst,
        sgst:payload1.sgst,
        igst:payload1.igst,

        grandTotal:payload1.grandTotal,
      },
      poItems: tasks1
    }

    return this.http.post(url, myObj);
  }

  listPurchaseOrder() {
    let url = this.baseUrl + '/listPurchaseOrder_1_0';
    return this.http.get(url);
  }

  

  listPurchaseOrderItems(payload:any) {
    let url = this.baseUrl + `/listPurchaseOrderItems_1_0/${payload.id}`;
    return this.http.get(url);
  }

  updateInventory(payload: any) {
    let url = this.baseUrl + '/updateInventory_1_0';
    return this.http.put(url, payload);
  }

  deleteInventory(payload: any) {
    let url = this.baseUrl + `/deleteInventory_1_0/${payload.id}/${1}`;
    return this.http.delete(url);
  }


  /* warrenty service */
  getWarranty(id: any) {
    let url = this.baseUrl + `/listWarranty_1_0/${id}`;
    return this.http.get(url);
  }

  updateWarranty(payload: any) {
    let url = this.baseUrl + '/updateWarranty_1_0';
    return this.http.put(url, payload);
  }

  deleteWarranty(payload: any) {
    let url = this.baseUrl + `/deleteWarranty_1_0/${payload.id}/${1}`;

    return this.http.delete(url);
  }

  updateInventoryStatus(payload: any) {
    let url = this.baseUrl + '/updateInventoryStatus_1_0';
    let params = new HttpParams();
    if (payload.slNo) {
      params = params.set('slNo', payload.slNo);
    }
    if (payload.statusId) {
      params = params.set('statusId', payload.statusId);
    }
    if (payload) {
      params = params.set('modifiedBy', 1);
    }

    return this.http.put(url, null, { params: params });
  }

  // listInventoryByItemCode(payload: any) {
  //   let url = this.baseUrl + "/listInventoryByItemCode_1_0";
  //   let params = new HttpParams().set('itemCode', payload.itemCode ? payload.itemCode : payload.suggestedItemCode);
  //   // if(payload.itemCode) {
  //   //   params = params.set('itemCode', payload.itemCode);
  //   // }
  //   if(payload.brand) {
  //     params = params.set('brand', payload.brand);
  //   }
  //   if(payload.model) {
  //     params = params.set('model', payload.model);
  //   }

  //   return this.http.get(url, {params: params});
  // }

  getItemCode(payload: any) {
    let url = this.baseUrl + '/getItemCode_1_0';
    let params = new HttpParams().set(
      'name',
      payload?.materialDescription ? payload?.materialDescription : payload
    );

    return this.http.get(url, { params: params });
  }

  /* product-master */
  listProduct() {
    let url = this.baseUrl + '/listProducts_1_0';
    return this.http.get(url);
  }
  createProduct(payload: any) {
    let url = this.baseUrl + '/createProduct_1_0';
    return this.http.post(url, payload);
  }
  updateSareesPrices(payload: any) {
    let url = this.baseUrl + '/updateSareesPrices_1_0';
    return this.http.put(url, payload);
  }
  updateProductMaster(payload: any) {
    let url = this.baseUrl + '/updateProduct_1_0';
    return this.http.put(url, payload);
  }
  deleteProduct(payload: any) {
    let url = this.baseUrl + `/deleteProduct_1_0/${payload.id}/${1}`;
    return this.http.delete(url);
  }
  listByVendor() {
    let url = this.baseUrl + '/listProduct_1_0';
    return this.http.get(url);
  }

  filterProductMaster(payload: any) {
    let url = this.baseUrl + `/listProduct_1_0`;
    let params = new HttpParams();
    if (payload.categoryId) {
      params = params.set('categoryId', payload.categoryId);
    }
    if (payload.typeId) {
      params = params.set('typeId', payload.typeId);
    }
    if (payload.statusId) {
      params = params.set('statusId', payload.statusId);
    }
    if (payload.startDate) {
      params = params.set('startDate', payload.startDate);
    }
    if (payload.endDate) {
      params = params.set('endDate', payload.endDate);
    }
    if (payload.vendorId) {
      params = params.set('vendorId', payload.vendorId);
    }

    return this.http.get(url, { params: params });
  }

  //Machine Productmaster//
  createMachineAssignment(payload: any) {
    let url = this.baseUrl + '/createMachineAssignment_1_0';
    return this.http.post(url, payload);
  }

  listMachineAssignment(payload?: any) {
    let url = this.baseUrl + '/listMachineAssignment_1_0';
    let params = new HttpParams();
    if (payload?.id) {
      params = params.set('p_id', payload?.id);
    }
    if (payload?.weaverName) {
      params = params.set('p_weaver_name', payload?.weaverName);
    }
    // if (payload?.id) {
    //   params = params.set('p_crd_id', payload?.id);
    // }
    return this.http.get(url, { params: params });
  }
  listMachineAssignmentSecond(payload?: any) {
    let url = this.baseUrl + '/listMachineAssignment_1_0';
    let params = new HttpParams();
 
    if (payload?.id) {
      params = params.set('p_crd_id', payload?.id);
    }
    return this.http.get(url, { params: params });
  }

  createAssignment(payload: any) {
    let url = this.baseUrl + '/createAssignment_1_0';
    return this.http.post(url, payload);
  }

  listAssignment() {
    let url = this.baseUrl + '/listAssignment_1_0';
    return this.http.get(url);
  }

  /* indents */
  listIndent() {
    let url = this.baseUrl + '/listIndents_1_0';
    return this.http.get(url);
  }

  listIndentItems(payload: any) {
    let url = this.baseUrl + '/listIndentItems_1_0';
    let params = new HttpParams().set('ticketId', payload?.ticketId);

    // if (payload.ticketId) {
    //   params = params.set('ticketId', payload.id);
    // }

    return this.http.get(url, { params: params });
  }

  listIndentItems1(payload: any) {
    let url = this.baseUrl + `/listIndentItems_1_0`;
    let params = new HttpParams()
      .set('ticketId', payload?.ticketId)
      .set('status', 4);

    return this.http.get(url, { params: params });
  }

  createIndent(payload: any) {
    let url = this.baseUrl + '/createIndent_1_0';
    return this.http.post(url, payload);
  }

  addComponent(payload: any) {
    let url = this.baseUrl + '/addComponent_1_0';
    return this.http.post(url, payload);
  }

  updateIndentStatus(payload1: any, payload2?: any) {
    let url =
      this.baseUrl +
      `/updateIndentStatus_1_0/${payload1.id}/${payload2.statusId}/${payload2.createdBy}/${payload2.inventoryId}`;
    return this.http.put(url, null);
  }

  updateIndentStatus1(currentId: any, payload: any) {
    let url =
      this.baseUrl +
      `/updateIndentStatus_1_0/${currentId.id}/${payload.statusId}/${payload.createdBy}`;
    return this.http.put(url, null);
  }

  deleteIndent(payload: any) {
    let url = this.baseUrl + `/deleteIndent_1_0/${payload.id}`;
    return this.http.delete(url);
  }

  replaceComponent(payload: any) {
    let url = this.baseUrl + `/replaceComponent_1_0`;
    let params = new HttpParams();
    if (payload.oldInventoryId) {
      params = params.set('oldInventoryId', payload.oldInventoryId);
    }
    if (payload.newInventoryId) {
      params = params.set('newInventoryId', payload.newInventoryId);
    }
    if (payload.replacedBy) {
      params = params.set('replacedBy', payload.replacedBy);
    }
    if (payload.siteId) {
      params = params.set('siteId', payload.siteId);
    }

    return this.http.put(url, null, { params: params });
  }

  filterIndent(payload: any) {
    let url = this.baseUrl + `/listIndent_1_0`;
    return this.http.get(url, { params: payload });
  }

  /* ticket sevice */
  listTickets() {
    let url = this.baseUrl + '/listTickets_1_0';
    return this.http.get(url);
  }
  listItemRequests() {
    let url = this.baseUrl + '/listItemRequests_1_0';
    return this.http.get(url);
  }

  createItemRequest(payload: any) {
    let url = this.baseUrl + '/createItemRequest_1_0';
    return this.http.post(url, payload);
  }

  updateItemRequestStatus(payload: any) {
    let url =
      this.baseUrl +
      `/updateItemRequestStatus_1_0/${payload.id}/${payload.statusId}/${payload.updatedBy}/${payload.inventoryId}`;
    return this.http.put(url, payload);
  }

  createTask(payload: any) {
    let url = this.baseUrl + '/createTask_1_0';
    return this.http.post(url, payload);
  }

  updateTicket(payload: any) {
    let url = this.baseUrl + '/updateTicket_1_0';
    return this.http.put(url, payload);
  }

  deleteTicket(payload: any) {
    let url = this.baseUrl + `/DeleteTicket?ticketId=${payload.ticketId}`;
    return this.http.delete(url);
  }

  listFRTickets(frId: any) {
    let url = this.baseUrl + `/listFRTickets_1_0/${frId}`;
    return this.http.get(url);
  }

  getTasks(ticketId: any) {
    let url = this.baseUrl + `/listTasks_1_0/${ticketId}`;
    return this.http.get(url);
  }

  getTicketVisits(siteId: any) {
    let url = this.baseUrl + `/listFieldVisits_1_0/${siteId}`;
    // let myObj = {
    //   'ticketId': ticketId,
    // }
    return this.http.get(url);
  }

  assignTicket(payload: any) {
    let url = this.baseUrl + '/assignTicket_1_0';
    return this.http.put(url, payload);
  }

  updateTask(payload: any) {
    let url = this.baseUrl + '/updateTask_1_0';
    return this.http.put(url, payload);
  }

  filterTicket(payload: any) {
    let url = this.baseUrl + `/listTickets_1_0`;
    let params = new HttpParams();
    if (payload.siteId) {
      params = params.set('siteId', payload.siteId);
    }
    if (payload.typeId) {
      params = params.set('typeId', payload.typeId);
    }
    if (payload.ticketStatus) {
      params = params.set('ticketStatus', payload.ticketStatus);
    }
    if (payload.startDate) {
      params = params.set(
        'startDate',
        formatDate(payload.startDate, 'yyyy-MM-dd', 'en-us')
      );
    }
    if (payload.endDate) {
      params = params.set(
        'endDate',
        formatDate(payload.endDate, 'yyyy-MM-dd', 'en-us')
      );
    }

    return this.http.get(url, { params: params });
  }

  getcomments(ticketId: any) {
    let url = this.baseUrl + '/getComments_1_0';
    let myObj = {
      ticketId: ticketId,
    };
    return this.http.get(url, { params: myObj });
  }

  createComment(payload: any) {
    let url = this.baseUrl + '/createComment_1_0';
    return this.http.post(url, payload);
  }

  /* ticket reorts */
  getTicketsReport() {
    let url = this.baseUrl + `/getTicketsReport_1_0`;
    return this.http.get(url);
  }

  getItemsList(payload: any) {
    let url = this.baseUrl + `/getItemsList_1_0`;
    let params = new HttpParams().set('siteId', payload?.siteId);
    return this.http.get(url, { params: params });
  }

  createFRKit(payload: any) {
    let url = this.baseUrl + `/createFRKit_1_0`;
    return this.http.post(url, payload);
  }

  listFRCount() {
    let url = this.baseUrl + `/listFRCount_1_0`;
    return this.http.get(url);
  }

  getItemCodes(slNo: any) {
    let url = this.baseUrl + `/getItemCodes_1_0`;
    let params = new HttpParams().set('slNo', slNo);
    return this.http.get(url, { params: params });
  }

  /* fr services */
  listFRSites(frId: any) {
    let url = this.baseUrl + `/listFRSites_1_0/${frId}`;
    return this.http.get(url);
  }

  listFRItems(frId: any, statusId: any) {
    let url = this.baseUrl + `/listFRItems_1_0`;
    let params = new HttpParams();
    if (frId) {
      params = params.set('frId', frId);
    }
    if (statusId) {
      params = params.set('statusId', statusId);
    }
    return this.http.get(url, { params: params });
  }

  fieldVisitEntry(payload: any) {
    let user: any = JSON.parse(localStorage.getItem('user')!);
    let url = this.baseUrl + `/fieldVisitEntry_1_0`;
    let myObj = {
      frId: user?.UserId,
      siteId: payload?.siteId,
      ticketId: payload?.ticketId,
    };

    return this.http.post(url, myObj);
  }

  listFRTasksOfCurrentVisit(frId: any, siteId: any) {
    let url = this.baseUrl + `/listFRTasksOfCurrentVisit_1_0/${frId}/${siteId}`;
    return this.http.get(url);
  }

  logTaskStatus(payload: any) {
    let url = this.baseUrl + `/logTaskStatus_1_0`;
    return this.http.post(url, payload);
  }

  fieldVisitExit(payload: any) {
    let url = this.baseUrl + `/fieldVisitExit_1_0`;
    return this.http.put(url, payload);
  }

  updateDispatchToInventory(payload: any) {
    let url = this.baseUrl + `/updateDispatchToInventory_1_0`;
    return this.http.post(url, payload);
  }

  /* fr-reports */
  listFRReports(payload: any) {
    let url = this.baseUrl + '/listFRReports_1_0';
    let params = new HttpParams();
    if (payload.p_frId) {
      params = params.set('p_frId', payload.p_frId);
    }
    if (payload.p_startdate) {
      params = params.set(
        'p_startdate',
        formatDate(payload.p_startdate, 'yyyy-MM-dd', 'en-us')
      );
    }
    if (payload.p_enddate) {
      params = params.set(
        'p_enddate',
        formatDate(payload.p_enddate, 'yyyy-MM-dd', 'en-us')
      );
    }
    return this.http.get(url, { params: params });
  }

  listDC() {
    let url = this.baseUrl + `/listDC_2_0`;
    return this.http.get(url);
  }

  getlistByCreatedBy(payload: any) {
    let url = this.baseUrl + `/getlistByCreatedBy_1_0`;
    let params = new HttpParams();
    if (payload.createdBy) {
      params = params.set('createdBy', payload.createdBy);
    }
    if (payload.dateOfChallan) {
      params = params.set(
        'dateOfChallan',
        formatDate(payload.dateOfChallan, 'yyyy-MM-dd', 'en-us')
      );
    }
    return this.http.get(url, { params: params });
  }

  /* dc challan */
  createDC(payload: any) {
    let url = this.baseUrl + '/createDC_1_0';
    return this.http.post(url, payload);
  }

  listDescriptionOfGoodsByDcNumber(payload: any) {
    let url = this.baseUrl + `/listDescriptionOfGoodsByDcNumber_1_0`;
    let params = new HttpParams().set('dcNumber', payload.dcNumber);
    return this.http.get(url, { params: params });
  }

  updateDC(payload: any) {
    let url = this.baseUrl + `/updateDC_2_0`;
    let params = new HttpParams()
      .set('dcNumber', payload.dcNumber)
      .set('amount', payload.amount)
      .set('receiptNo', payload.receiptNo)
      .set('modifiedBy', payload.modifiedBy);
    return this.http.put(url, null, { params: params });
  }

  listQuantity(payload: any) {
    let url = this.baseUrl + `/listQuantity_1_0`;
    let params = new HttpParams()
      .set('itemCode', payload?.itemCode)
      .set('statusId', payload?.statusId)
      .set('modifiedBy', payload?.modifiedBy);
    return this.http.get(url, { params: params });
  }

  getAllDC(payload: any) {
    let url = this.baseUrl + '/getAllDC_2_0';
    let params = new HttpParams();
    if (payload.createdBy) {
      params = params.set('createdBy', payload.createdBy);
    }
    if (payload.dateOfChallan) {
      params = params.set(
        'dateOfChallan',
        formatDate(payload.dateOfChallan, 'yyyy-MM-dd', 'en-us')
      );
    }
    if (payload.state) {
      params = params.set('state', payload.state);
    }
    return this.http.get(url, { params: params });
  }

  /* -------------------------------------------------------------- end ------------------------------------------------------------------------------------ */

  /* orders */
  listOrders() {
    let url = this.baseUrl + '/listOrders_1_0';
    return this.http.get(url);
  }

  createOrder(payload: any) {
    let url = this.baseUrl + '/createOrder_1_0';
    return this.http.post(url, payload);
  }

  updateOrder(payload: any) {
    let url = this.baseUrl + '/updateQuantity_1_0';
    let params = new HttpParams()
      .set('id', payload.id)
      // .set('invoiceNo', payload.invoiceNo)
      .set('quantity', payload.quantity)
      // .set('remarks', payload.remarks);
    return this.http.put(url, null, { params: params });
  }

  deleteOrder(payload: any) {
    let url = this.baseUrl + `/deleteItem_1_0/${payload.id}`;
    return this.http.delete(url);
  }

  filterOrders(payload: any) {
    let url = this.baseUrl + `/listOrders_1_0`;
    return this.http.get(url, { params: payload });
  }

  listOrderItems() {
    let url = this.baseUrl + '/listOrderItems_1_0';
    return this.http.get(url);
  }

  listOrderItemsById(id: any) {
    let url = this.baseUrl + '/listOrderItems_1_0';
    let myObj = {
      orderId: id,
    };
    return this.http.get(url, { params: myObj });
  }

  addItemToOrder(payload: any) {
    let url = this.baseUrl + '/addItemToOrder_1_0';
    return this.http.post(url, payload);
  }

  updateOrderItem(payload: any) {
    let url = this.baseUrl + '/updateOrderItem_1_0';
    let params = new HttpParams()
      .set('id', payload.id)
      .set('productQuantity', payload.productQuantity)
      .set('by', payload.by);
    return this.http.put(url, null, { params: params });
  }

  deleteOrderItem(payload: any) {
    let url = this.baseUrl + `/deleteOrderItem_1_0/${payload.id}`;
    return this.http.delete(url);
  }

  /* vendor service */
  listVendors() {
    let url = this.baseUrl + '/listVendors_1_0';
    return this.http.get(url);
  }

  listVendorsById(vendorId: any) {
    let url = this.baseUrl + `/listProduct_1_0?vendorId=${1}&statusId=${1}`;
    return this.http.get(url);
  }

  createVendors(payload: any) {
    let url = this.baseUrl + '/createVendor_1_0';
    return this.http.post(url, payload);
  }

  updatevendor(payload: any) {
    let url = this.baseUrl + '/updateVendor_1_0';
    return this.http.put(url, payload);
  }

  deleteVendor(payload: any) {
    let url = this.baseUrl + `/deleteVendor_1_0/${payload.id}/${1}`;
    return this.http.delete(url);
  }

  listUsersByRole() {
    let url = 'http://34.206.37.237:80/userDetails' + '/listUsersByRole_1_0';
    let params = new HttpParams().set('roleId', 30);
    return this.http.get(url, { params: params });
  }

  listVendorDetails(payload: any) {
    let url = this.baseUrl + '/listVendorDetails_1_0';
    let params = new HttpParams().set('vendorName', payload.vendorName);
    return this.http.get(url, { params: params });
  }

  listInventoryFirst() {
    let url = this.baseUrl + '/listInventory_1_0';
    return this.http.get(url);
  }

  buyNow(data: any) {
    let user = JSON.parse(localStorage.getItem('user')!);
    let url = this.baseUrl + '/createClientRequest_1_0';
    let obj = {
      clientRequest: {
        clientName: user?.UserName,
        description: '',
        emailId: user?.email,
        mobileNumber: '0000000000',
        createdBy: user.UserId,
      },
      clientRequestDetails: [
        {
          itemCode: data?.itemCode,
          clothType: data?.itemName,
          color: data?.color,
          colorCode: data?.colorCode,
          cost: data?.cost,
          price: data?.price,
          quality: data?.quality,
          image: data?.image,
          quantity: 1,
          remarks: data?.remarks,
          type: 'Order',
        },
      ],
    };
    return this.http.post(url, obj);
  }

  createClientRequest(payload1:any,tasks: any) {
    // console.log(tasks)
    let user = JSON.parse(localStorage.getItem('user')!);
    let url = this.baseUrl + '/createClientRequest_1_0';
    let obj = {
      clientRequest: {
        clientName: payload1?.clientName,
        description: payload1?.description,
        emailId: payload1?.emailId,
        mobileNumber:payload1?.mobileNumber,
        createdBy: user?.UserId,
        address:payload1?.address,
        city: payload1?.city,
        country: payload1?.country,
        pinCode: payload1?.pinCode,
        state: payload1?.state,
        gstin:  payload1?.gstin,
        panNo:  payload1?.panNo,
        poNo:  payload1?.poNo,
        poDate:  payload1?.poDate,
      },
      clientRequestDetails: tasks,
    };
    return this.http.post(url, obj);
  }

  createCart(payload: any) {
    let user = JSON.parse(localStorage.getItem('user')!);
    let url = this.baseUrl + '/createCart_1_0';
    let obj = {
      used: payload.used,
      image: payload.image,
      cost: payload.cost,
      quality: payload.quality,
      color: payload.color,
      price: payload.price,
      itemCode: payload.itemCode,
      colorCode: payload.colorCode,
      createdTime: formatDate(new Date(), 'yyyy-MM-ddThh:mm:ss', 'en-us'),
      itemType: payload.itemType,
      modifiedTime: payload.modifiedTime ? payload.modifiedTime : null,
      modifiedBy: payload.modifiedBy ? payload.modifiedBy : null,
      itemName: payload.itemName,
      remarks: payload.remarks ? payload.remarks : null,
      purchases: payload.purchases,
      dispatched: payload.dispatched,
      stockOnStartDate: payload.stockOnStartDate,
      others: payload.others,
      inStock: payload.inStock,
      createdBy: user?.UserId
    };
    return this.http.post(url, obj);
  }

  listCart() {
    let user = JSON.parse(localStorage.getItem('user')!);
    let url = this.baseUrl + '/listCart_1_0';
    let params = new HttpParams().set('createdBy', user?.UserId);
    return this.http.get(url, { params: params });
  }

  listClientRequestDetails() {
    let url = this.baseUrl + '/listClientRequestDetails_1_0';
    return this.http.get(url);
  }

  assignMachineAndItems(payload1: any, payload2: any) {
    let url = this.baseUrl + '/assignMachineAndItems_1_0';
    let obj = {
      machineAssignment: {
        weaverId: payload1.weaverId,
        weaverName: payload1.weaverName,
        machineNoAliasInventoryId: payload1.machineNoAliasInventoryId,
        crdId: payload1.crdId,
        expectedDate: payload1.expectedDate,
        sareeCount: payload1.sareeCount,
      },
      itemRequest: payload2,
    };
    return this.http.post(url, obj);
  }

  listInventoryForSending(payload: any) {
    let url = this.baseUrl + '/listInventoryForSending_1_0';
    let params = new HttpParams();
    if (payload.itemCode) {
      params = params.set('itemCode', payload.itemCode);
    }
    if (payload.cost) {
      params = params.set('cost', payload.cost);
    }
    if (payload.quality) {
      params = params.set('quality', payload.quality);
    }
    if (payload.colorCode) {
      params = params.set('colorCode', payload.colorCode);
    }
    if (payload.color) {
      params = params.set('color', payload.color);
    }
    // if (payload.price) {
    //   params = params.set('cost', payload.price);
    // }
    return this.http.get(url, { params: params });
  }
  listInventoryForSending1(payload:any) {
    let url = this.baseUrl + '/listInventoryForSending_1_0';
    let params = new HttpParams();
    if (payload.suggestedItemCode) {
      params = params.set('itemCode', payload.suggestedItemCode);
    }
    return this.http.get(url, { params: params });
  }

  ViewInvRawMaterials(payload: any) {
    let url = this.baseUrl + '/ViewInvRawMaterials';
    let params = new HttpParams();
    if (payload.itemCode) {
      params = params.set('itemCode', payload.itemCode);
    }
    if (payload.colorCode) {
      params = params.set('colorCode', payload.colorCode);
    }
    if (payload.color) {
      params = params.set('color', payload.color);
    }
    if (payload.cost) {
      params = params.set('cost', payload.cost);
    }
    if (payload.quality) {
      params = params.set('quality', payload.quality);
    }
 
    // if (payload.price) {
    //   params = params.set('price', payload.price);
    // }
    return this.http.get(url, { params: params });
  }

  updateInventoryStatusForFGSending(payload: any) {
    let url = this.baseUrl + '/updateInventoryStatusForFGSending_1_0';
    return this.http.put(url, payload);
  }

  // Sales
  CreateInvoice(payload1:any, payload2:any, payload3:any) {
    let user = JSON.parse(localStorage.getItem('user')!);
    let url = this.baseUrl + '/CreateInvoice_1_0';
    let obj;
    if(payload3) {
      obj = {
        taxInvoice: {
          clientRequestId:payload1.clientRequestId,
          subTotal:payload1.subTotal,

          igstPercent:payload1.igstPercent,
          sgstPercent:payload1.sgstPercent,
          cgstPercent:payload1.cgstPercent,

          cgst:payload1.cgst,
          sgst:payload1.sgst,
          igst:payload1.igst,
          grandTotal:payload1.grandTotal,
          address:payload1.address,
          mobileNumber:payload1.mobileNumber,
          emailId:payload1.emailId,
          city: payload1?.city,
          country: payload1?.country,
          pinCode: payload1?.pinCode,
          state: payload1?.state
          // createdBy:user.UserId,
        },
        sales: payload2,
        walkInRequest: {
            customerName: payload3?.customerName,
            mobileNumber:payload3?.mobileNumber ,
            emailId:payload3?.emailId,
            // country:payload3?.country,
            state:payload3?.state
        }
        
      }
    } else {
      obj = {
        taxInvoice: {
          clientRequestId:payload1.clientRequestId,
          subTotal:payload1.subTotal,

          igstPercent:payload1.igstPercent,
          sgstPercent:payload1.sgstPercent,
          cgstPercent:payload1.cgstPercent, 

          cgst:payload1.cgst,
          sgst:payload1.sgst,
          igst:payload1.igst,
          grandTotal:payload1.grandTotal,
          // address:payload1.address,
          // mobileNumber:payload1.mobileNumber,
          // emailId:payload1.emailId,
          // city: payload1?.city,
          // country: payload1?.country,
          // pinCode: payload1?.pinCode,
          // state: payload1?.state
          // createdBy:user.UserId,
        },
        sales: payload2
      }
    }
    return this.http.post(url, obj);
  }

  listInvoices(payload?: any) {
    let url = this.baseUrl + '/listInvoices_1_0';
    let params = new HttpParams();
    if(payload?.startDate) {
      params = params.set('startDate', formatDate(payload?.startDate, 'yyyy-MM-dd', 'en-us'));
    } 
    if(payload?.endDate) {
      params = params.set('endDate', formatDate(payload?.endDate, 'yyyy-MM-dd', 'en-us'));
    } 
    if(payload?.invoiceNo) {
      params = params.set('invoiceNo', payload?.invoiceNo);
    }
    return this.http.get(url, {params: params});
  }

  listReturnItems(payload:any) {
    let params = new HttpParams();
    let url = this.baseUrl + '/listReturnItems_1_0';
    if(payload?.taxInvoiceId) {
      params = params.set('taxInvoiceId', payload?.taxInvoiceId);
    } 
    return this.http.get(url, {params: params});
  }

  updateReturnItems(payload:any) {
    let url = this.baseUrl + '/updateReturnItems_1_0';
    return this.http.put(url,payload)
  }

  // listInvoicesForFilter(payload:any) {
  //   let url = this.baseUrl + '/listInvoices_1_0';
  //   let params = new HttpParams().set('startDate' ,formatDate(payload.startDate, 'yyyy-MM-dd' , 'en-us') ).set('endDate', formatDate(payload.endDate, 'yyyy-MM-dd', 'en-us'))
  //   return this.http.get(url, {params:params});
  // }

  listPOForm(payload?:any) {
    let url = this.baseUrl + '/listPOForm_1_0';
    let params = new HttpParams()
    if(payload?.purchaseRef) {
      params = params.set('purchaseRef',payload?.purchaseRef);
    }
    return this.http.get(url,{params:params});
  }


  // listInvoicesForReceipt() {
  //   let url = this.baseUrl + '/listInvoices_1_0';
  //   return this.http.get(url)
  // }

  listGoodReceiptNote(payload?:any) {
    let url = this.baseUrl + '/listGoodReceiptNote_1_0';
    let params = new HttpParams()
    if(payload?.invoiceNumber) {
      params = params.set('invoiceNumber',payload?.invoiceNumber);
    }
    if(payload?.vendorName) {
      params = params.set('vendorName',payload?.vendorName);
    }
  
    return this.http.get(url, { params: params });
  }



  listClientRequests(payload?:any) {
    let url = this.baseUrl + '/listClientRequests_1_0';
    let params = new HttpParams()
    if(payload?.id) {
      params = params.set('Id',payload?.id);
    }
  
    return this.http.get(url, { params: params });
  }

  listClientRequestsForId(payload?:any) {
    let url = this.baseUrl + '/listClientRequests_1_0';
    let params = new HttpParams()
    if(payload?.clientRequestId) {
      params = params.set('Id',payload?.clientRequestId);
    }
  
    return this.http.get(url, { params: params });
  }

  listClientRequestsForInventory() {
    let url = this.baseUrl + '/listClientRequests_1_0';
    return this.http.get(url);
  }


  updateSarees(payload:any) {
    let url = this.baseUrl + '/updateSarees_1_0'
    return this.http.post(url,payload)
  }

  listOutputSarees() {
    let url = this.baseUrl + '/listOutputSarees_1_0';
    return this.http.get(url);
  }
  ViewOutSareeInInv(payload?:any) {
    let url = this.baseUrl + '/ViewOutSareeInInv_1_0';
    // let params = new HttpParams()
    // if(payload?.id) {
    //   params = params.set('in_ir_machine_assignment_id',payload.id)
    // }
    let params = new HttpParams().set('in_ir_machine_assignment_id',payload?.irMachineAssignmentId);
    return this.http.get(url, { params: params });
  }

  dashboard() {
    let url = this.baseUrl + '/dashboard_1_0';
    let params = new HttpParams().set('startDate' , '2024-02-01').set('endDate' ,formatDate(new Date(), 'yyyy-MM-dd', 'en-us'))
    return this.http.get(url,{params:params});
  }

  listDashboard(payload:any) {
    let url = this.baseUrl + '/listDashboard_1_0'
    let params = new HttpParams().set('startDate' , '2024-02-06').set('endDate' ,formatDate(new Date(), 'yyyy-MM-dd', 'en-us'))

    return this.http.get(url,{params:params});
  }

  Filterdashboard(payload?:any) {
    let url = this.baseUrl + '/dashboard_1_0';
    let params = new HttpParams()
    if(payload?.startDate) {
      params = params.set('startDate', formatDate(payload?.startDate, 'yyyy-MM-dd', 'en-us'))
    }
    if(payload?.endDate) {
      params = params.set('endDate', formatDate(payload?.endDate, 'yyyy-MM-dd', 'en-us'))
    }
    return this.http.get(url,{params:params});
  }

  View(payload?:any) {
    let url = this.baseUrl + '/ViewInvRawMaterials';
    let params = new HttpParams()
    if(payload?.color) {
      params = params.set('color',payload?.color)
    }
    if(payload?.colorCode) {
      params = params.set('colorCode',payload?.colorCode)
    }
    if(payload?.quality) {
      params = params.set('quality',payload?.quality)
    }
    if(payload?.cost) {
      params = params.set('cost',payload?.cost)
    }
    if(payload?.itemCode) {
      params = params.set('itemCode',payload?.itemCode)
    }
    return this.http.get(url,{params:params});
  }


  setSareesPrices(payload:any) {
    let url = this.baseUrl + '/setSareesPrices_1_0';
    return this.http.post(url,payload);
  }
  
 

  // listSareesPrices(payload:any) {
  //   let url = this.baseUrl + '/listSareesPrices_1_0';
  //   let params = new HttpParams().set('itemCode',payload?.itemCode);
  //   return this.http.get(url, { params: params });
  // }


  createRawMaterials(payload:any, inventoryRawMaterials: any) {
    let user = JSON.parse(localStorage.getItem('user')!);
    let url = this.baseUrl + '/createRawMaterials_1_0';
    let myObj = {
      goodReceiptNote: payload, 
      inventoryRawMaterials: inventoryRawMaterials
    }

    return this.http.post(url, myObj);
  }








  
}

