import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { OrderComponent } from "./components/order/order.component";
import { DetailProductComponent } from "./components/detail-product/detail-product.component";
import { RegisterComponent } from "./components/register/register.component";
import { LoginComponent } from "./components/login/login.component";
import { NgModule } from "@angular/core";
import { AuthGuardFn } from "./guards/auth.guard";
import { AdminGuardFn } from "./guards/admin.guard";
import { UserComponent } from "./components/user-profile/user.profile.component";
import { AdminComponent } from "./components/admin/admin.component";
import { OrderAdminComponent } from "./components/admin/order/order.admin.component";
import { ProductAdminComponent } from "./components/admin/product/product.admin.component";
import { CategoryAdminComponent } from "./components/admin/category/category.admin.component";
import { DetailOrderAdminComponent } from "./components/admin/detail-order/detail.order.admin.component";
import { ErrorComponent } from "./components/error/error.component";
import { ForgetPasswordComponent } from "./components/login/forget-pasword/forget.password.component";
import { PurchaseOrderComponent } from "./components/purchase-order/purchase.order.component";
import { OrderConfirmComponent } from "./components/order-confirm/order.confirm.component";

// import { OrderAdminComponent } from "./components/admin/order/order.admin.component";

const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'forget-password', component: ForgetPasswordComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'products/:id', component: DetailProductComponent},
    {path: 'orders', component: OrderComponent,canActivate:[AuthGuardFn]},
    {path: 'order-confirm/:id', component: OrderConfirmComponent},
    {path: 'purchase-orders/:id', component: PurchaseOrderComponent},
    {path: 'user-profile', component: UserComponent,canActivate:[AuthGuardFn]},
    //admin
    {path: 'admin', component: AdminComponent, canActivate:[AdminGuardFn]},
        
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule{

}
