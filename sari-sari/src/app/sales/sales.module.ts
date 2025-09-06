import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SalesPage } from './sales.page';
import { SalesPageRoutingModule } from './sales-routing.module';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, SalesPageRoutingModule],
  declarations: [SalesPage]
})
export class SalesPageModule {}
