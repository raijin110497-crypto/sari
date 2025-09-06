import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportsPage } from './reports.page';
import { ReportsRoutingModule } from './reports-routing.module';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, ReportsRoutingModule],
  declarations: [ReportsPage]
})
export class ReportsModule {}
