import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ApiService } from '../../core/services/api/api.service';
import { loginSuccess } from '../../store/actions/user.actions';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './login.page.html'
})
export class LoginPage {
  email = '';
  password = '';
  public name = '';

  constructor(private readonly api: ApiService, private readonly store: Store, private readonly router: Router) {}

  login() {
    if (!this.name || !this.email || !this.password) {
      return;
    }
    this.api.login(this.email, this.password).subscribe({
      next: user => {
        this.store.dispatch(loginSuccess({ user }));
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        // Optionally handle error (e.g., show a message)
      }
    });
  }
}