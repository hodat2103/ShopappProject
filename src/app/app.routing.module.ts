import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { OrderDetailComponent } from "./components/order-confirm/order.detail.component";
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

// import { OrderAdminComponent } from "./components/admin/order/order.admin.component";

const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'products/:id', component: DetailProductComponent},
    {path: 'orders', component: OrderComponent,canActivate:[AuthGuardFn]},
    {path: 'orders/:id', component: OrderDetailComponent},
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
