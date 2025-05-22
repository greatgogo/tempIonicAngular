import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../core/models/user.model';
import { selectUser } from '../../store/selectors/user.selectors';
import { logout } from '../../store/actions/user.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  standalone: false
})
export class DashboardPage {
  user$: Observable<User | null>;

  constructor(private readonly store: Store, private readonly router: Router) {
    this.user$ = this.store.select(selectUser);
  }

  logout() {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }
}