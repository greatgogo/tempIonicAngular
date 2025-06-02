import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DashboardPage } from './dashboard.page';
import { RouterModule } from '@angular/router';
import { AppDatePipe } from '../../shared/pipes/app-date.pipe';

@NgModule({
  imports: [
    DashboardPage,
    AppDatePipe,
    CommonModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: DashboardPage }])
  ]
})
export class DashboardPageModule {}