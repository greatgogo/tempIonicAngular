import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { signup } from '../../store/actions/user.actions';
import { ApiService } from '../../core/services/api/api.service';

@Component({
  selector: 'app-signup',
  imports: [IonicModule, FormsModule, RouterModule],
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  name = '';
  email = '';
  password = '';

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly api: ApiService
  ) { }

  onSignup() {
    if (!this.name || !this.email || !this.password) {
      return;
    }
    this.api.signup({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => {
        this.store.dispatch(signup({ user: { name: this.name, email: this.email, password: this.password } }));
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        // Optionally handle error (e.g., show a message)
      }
    });
  }
}
