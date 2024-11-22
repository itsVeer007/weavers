import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//components
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { AddNewSiteComponent } from './main-dashboard/add-new-site/add-new-site.component';
import { AddNewCameraComponent } from './main-dashboard/add-new-camera/add-new-camera.component';
import { AddNewCustomerComponent } from './main-dashboard/add-new-customer/add-new-customer.component';
import { AddNewBusinessVerticalComponent } from './main-dashboard/add-new-business-vertical/add-new-business-vertical.component';
import { AddNewUserComponent } from './main-dashboard/add-new-user/add-new-user.component';
import { LoginComponent } from './login/login.component';
import { AddAdditionalSiteComponent } from './main-dashboard/add-additional-site/add-additional-site.component';
import { AddDeviceComponent } from './main-dashboard/add-device/add-device.component';
import { AddNewAssetComponent } from './main-dashboard/add-new-asset/add-new-asset.component';
import { AddNewInventoryComponent } from './main-dashboard/add-new-inventory/add-new-inventory.component';
import { AddNewAnalyticComponent } from './main-dashboard/add-new-analytic/add-new-analytic.component';
import { AddNewTicketComponent } from './main-dashboard/add-new-ticket/add-new-ticket.component';
import { AddMetadataComponent } from './main-dashboard/add-metadata/add-metadata.component';
import { DeviceViewComponent } from './main-dashboard/add-device/device-view/device-view.component';
import { AddProductMasterComponent } from './main-dashboard/add-product-master/add-product-master.component';
import { AddNewVendorComponent } from './main-dashboard/add-new-vendor/add-new-vendor.component';
import { AddNewDeviceComponent } from './main-dashboard/add-new-device/add-new-device.component';
import { AddNewOrderComponent } from './main-dashboard/add-new-order/add-new-order.component';
import { AddNewIndentComponent } from './main-dashboard/add-new-indent/add-new-indent.component';
import { AddNewFrkitComponent } from './main-dashboard/add-new-frkit/add-new-frkit.component';
import { LoginLoaderComponent } from './utilities/loader/login-loader.component';
import { AddNewDcComponent } from './main-dashboard/add-new-dc/add-new-dc.component';

// material module
import { MatFormFieldModule as MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule as MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule as MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule as MatListModule } from '@angular/material/list';
import { MatAutocompleteModule as MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule as MatButtonModule } from '@angular/material/button';
import { MatTabsModule as MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule as MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule as MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule as MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule as MatCardModule } from '@angular/material/card';
import { MatDialogModule as MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule as MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule as MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import {MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

//utilities
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { VjsPlayerComponent } from './utilities/vjs-player/vjs-player.component';
import { LoaderComponent } from './utilities/loader/loader.component';
import { ChartService } from 'src/services/chart.service';
import { DatePipe } from '@angular/common';
import { SearchPipe } from './pipes/search.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { ErrorPageComponent } from './utilities/error-page/error-page.component';
import { DcChallanComponent } from './utilities/dc-challan/dc-challan.component';
import { RemoveDuplicatesPipe } from './utilities/pipes/remove-duplicates.pipe';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { AdvertisementsComponent } from './components/advertisements/advertisements.component';
import { FrKitComponent } from './components/fr-kit/fr-kit.component';
import { AdInfoComponent } from './components/assets/ad-info/ad-info.component';
import { CustomersComponent } from './components/customers/customers.component';
import { DevicesComponent } from './components/devices/devices.component';
import { FrReportsComponent } from './components/fr-reports/fr-reports.component';
import { FrComponent } from './components/fr/fr.component';
import { IndentsComponent } from './components/indents/indents.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { MetaDataComponent } from './components/meta-data/meta-data.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProductMasterComponent } from './components/product-master/product-master.component';
import { QRAdsComponent } from './components/qr-ads/qr-ads.component';
import { SitesComponent } from './components/sites/sites.component';
import { TicketReportsComponent } from './components/ticket-reports/ticket-reports.component';
import { TicketsComponent } from './components/tickets/tickets.component';
import { UsersComponent } from './components/users/users.component';
import { VendorsComponent } from './components/vendors/vendors.component';
import { VerticalsComponent } from './components/verticals/verticals.component';
import { WifiAdsComponent } from './components/wifi-ads/wifi-ads.component';
import { WifiAnalyticsComponent } from './components/wifi-analytics/wifi-analytics.component';
import { DeviceInfoComponent } from './components/devices/device-info/device-info.component';
import { AssetsComponent } from './components/assets/assets.component';
import { InventorySalesComponent } from './components/inventory-sales/inventory-sales.component';
import { SalesComponent } from './components/sales/sales.component';
import { WeaverWorksComponent } from './components/weaver-works/weaver-works.component';
import { ClientRequestsComponent } from './components/client-requests/client-requests.component';
import { RawMaterialsComponent } from './components/raw-materials/raw-materials.component';
import { TaxInvoiceComponent } from './components/tax-invoice/tax-invoice.component';
import { GoodReceiptComponent } from './components/good-receipt/good-receipt.component';
import { MypipePipe } from './mypipe.pipe';
import { NumberToWordsPipe } from './pipes/number-to-words.pipe';
import { PurchaseComponent } from './purchase/purchase.component';
import { ItemNameValidatorPipe } from './item-name-validator.pipe';
import { ItemNameValidatorComponent } from './item-name-validator/item-name-validator.component';
import { OnlyNumbersDirectiveDirective } from './only-numbers-directive.directive';
import { NgxPrintElementModule } from 'ngx-print-element';
import { RemoveDuplicatesForTwoPipe } from './remove-duplicates-for-two.pipe';











@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MainDashboardComponent,
    AddNewSiteComponent,
    AddNewCameraComponent,
    AddNewCustomerComponent,
    AddNewBusinessVerticalComponent,
    AddNewUserComponent,
    SitesComponent,
    CustomersComponent,
    LoaderComponent,
    LoginLoaderComponent,
    LoginComponent,
    UsersComponent,
    AddAdditionalSiteComponent,
    AssetsComponent,
    TicketsComponent,
    InventoryComponent,
    AddDeviceComponent,
    AddNewAssetComponent,
    VjsPlayerComponent,
    VerticalsComponent,
    AnalyticsComponent,
    AddNewInventoryComponent,
    AddNewAnalyticComponent,
    AddNewTicketComponent,
    AdInfoComponent,
    MetaDataComponent,
    AddMetadataComponent,
    DeviceViewComponent,
    DevicesComponent,
    ProductMasterComponent,
    AddProductMasterComponent,
    QRAdsComponent,
    WifiAdsComponent,
    VendorsComponent,
    AddNewVendorComponent,
    AddNewDeviceComponent,
    OrdersComponent,
    AddNewOrderComponent,
    IndentsComponent,
    AddNewIndentComponent,
    FrComponent,
    TicketReportsComponent,
    AdvertisementsComponent,
    FrKitComponent,
    AddNewFrkitComponent,
    FrReportsComponent,
    AddNewDcComponent,
    SearchPipe,
    SortPipe,
    ErrorPageComponent,
    DcChallanComponent,
    RemoveDuplicatesPipe,
    WifiAnalyticsComponent,
    DeviceInfoComponent,
    InventorySalesComponent,
    SalesComponent,
    WeaverWorksComponent,
    ClientRequestsComponent,
    RawMaterialsComponent,
    TaxInvoiceComponent,
    GoodReceiptComponent,
    MypipePipe,
    NumberToWordsPipe,
    PurchaseComponent,
    ItemNameValidatorPipe,
    ItemNameValidatorComponent,
    OnlyNumbersDirectiveDirective,
    RemoveDuplicatesForTwoPipe,



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatDividerModule,
    MatListModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatTabsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatProgressBarModule,
    MatCardModule,
    MatDialogModule,
    MatSidenavModule,
    MatMenuModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatBadgeModule,
    MatSlideToggleModule,
    MatTooltipModule,
    NgxPrintElementModule,
    
    
    
    
    
  ],
  providers: [
    DatePipe,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
