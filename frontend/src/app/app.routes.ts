import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RingsComponent } from './components/rings/rings.component';
import { BraceletsComponent } from './components/bracelets/bracelets.component';
import { NecklacesComponent } from './components/necklaces/necklaces.component';
import { EarringsComponent } from './components/earrings/earrings.component';
import { NewArrivalsComponent } from './components/new-arrivals/new-arrivals.component';
import { SalesComponent } from './components/sales/sales.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ViewCartComponent } from './components/view-cart/view-cart.component';
import { CheckoutDetailsComponent } from './components/checkout-details/checkout-details.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { AccountComponent } from './components/account/account.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { AuthGuard } from './guards/auth.guard';
import { ADMIN_ROUTES } from './routes/admin.routes';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'categories/rings', component: RingsComponent },
  { path: 'categories/bracelets', component: BraceletsComponent },
  { path: 'categories/necklaces', component: NecklacesComponent },
  { path: 'categories/earrings', component: EarringsComponent },
  { path: 'new-arrivals', component: NewArrivalsComponent },
  { path: 'sales', component: SalesComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'cart', component: ViewCartComponent },
  { path: 'checkout', component: CheckoutDetailsComponent },
  { path: 'order', component: OrderDetailsComponent },
  { path: 'account', component: AccountComponent },
  { path: 'wishlist', component: WishlistComponent, canActivate: [AuthGuard] },
  { path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthGuard] },
  { path: 'unauthorized', component: UnauthorizedComponent },
  ...ADMIN_ROUTES
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled', // Permet de remonter en haut de la page
      anchorScrolling: 'enabled', // (Optionnel) Active le scroll vers les ancres si vous en avez
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}