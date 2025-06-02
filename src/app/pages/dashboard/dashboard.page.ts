import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../core/models/user.model';
import { selectUser } from '../../store/selectors/user.selectors';
import { logout } from '../../store/actions/user.actions';
import { Router } from '@angular/router';
import { AppDatePipe } from '../../shared/pipes/app-date.pipe';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  // Add the pipe to the imports if using standalone, otherwise declare in module
  imports: [IonButton, IonContent, IonTitle, IonToolbar, IonHeader, AppDatePipe]
})
export class DashboardPage {
  user$: Observable<User | null>;
  today = new Date();

  constructor(private readonly store: Store, private readonly router: Router) {
    this.user$ = this.store.select(selectUser);
  }

  logout() {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }
}