import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DashboardPage } from './dashboard.page';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [DashboardPage],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: DashboardPage }])
  ]
})
export class DashboardPageModule {}