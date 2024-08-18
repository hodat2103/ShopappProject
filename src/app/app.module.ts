import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // Import NgbModule

import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app.routing.module'; // Ensure the path is correct
import { AdminRoutingModule } from './components/admin/admin-routing.module';

import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { OrderComponent } from './components/order/order.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { UserComponent } from './components/user-profile/user.profile.component';
import { AdminComponent } from './components/admin/admin.component';
import { OrderAdminComponent } from './components/admin/order/order.admin.component';
import { CategoryAdminComponent } from './components/admin/category/category.admin.component';
import { ProductAdminComponent } from './components/admin/product/product.admin.component';
import { DetailOrderAdminComponent } from './components/admin/detail-order/detail.order.admin.component';
import { InsertCategoryAdminComponent } from './components/admin/category/insert/insert.category.admin.component';
import { UpdateCategoryAdminComponent } from './components/admin/category/update/update.category.admin.component';
import { UserAdminComponent } from './components/admin/user/user.admin.component';
import { ForgetPasswordComponent } from './components/login/forget-pasword/forget.password.component';
import { PurchaseOrderComponent } from './components/purchase-order/purchase.order.component';
import { Location } from '@angular/common';
import { OrderConfirmComponent } from './components/order-confirm/order.confirm.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    OrderComponent,
    OrderConfirmComponent,
    LoginComponent,
    RegisterComponent,
    OrderAdminComponent,
    PurchaseOrderComponent,
    DetailProductComponent,
    UserComponent,
    AdminComponent,
    CategoryAdminComponent,
    ProductAdminComponent,
    DetailOrderAdminComponent,
    InsertCategoryAdminComponent,
    UpdateCategoryAdminComponent,
    UserAdminComponent,
    ForgetPasswordComponent
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule, // Ensure this is correctly referenced
    AdminRoutingModule,
    NgbModule,
     // Thêm NgbModule vào imports
  ],
  providers: [
    Location,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
