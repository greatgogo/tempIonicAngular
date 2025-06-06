import { Component, OnDestroy } from '@angular/core';
import { IonicModule, Platform } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { signup } from '../../store/actions/user.actions';
import { ApiService } from '../../core/services/api/api.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-signup',
  imports: [IonicModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnDestroy {
  name = '';
  email = '';
  password = '';
  private backButtonSubscription: any;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly api: ApiService,
    private readonly platform: Platform
  ) { }

  ionViewDidEnter() {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
      this.router.navigate(['/']); // Navigate to the home or previous page
    });
  }

  ionViewWillLeave() {
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }

  ngOnDestroy() {
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }

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
