import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';



import { HomeComponent } from './components/home/home.component';
import { OrderComponent } from './components/order/order.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { AppModule } from './app.module';
import { AppComponent } from './app/app.component';
import { OrderAdminComponent } from './components/admin/order/order.admin.component';

@NgModule({
  imports: [

    ServerModule
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
