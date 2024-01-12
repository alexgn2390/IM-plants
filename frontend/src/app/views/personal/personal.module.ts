import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalRoutingModule } from './personal-routing.module';
import { FavouriteComponent } from './favourite/favourite.component';
import { OrdersComponent } from './orders/orders.component';
import { InfoComponent } from './info/info.component';
import {SharedModule} from "../../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    FavouriteComponent,
    OrdersComponent,
    InfoComponent,

  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    PersonalRoutingModule
  ]
})
export class PersonalModule { }
