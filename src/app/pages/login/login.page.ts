import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ApiService } from '../../core/services/api/api.service';
import { loginSuccess } from '../../store/actions/user.actions';
import { Router } from '@angular/router';
import { IonicModule, ToastController, Platform } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  imports: [IonicModule, FormsModule, TranslateModule],
  templateUrl: './login.page.html'
})
export class LoginPage implements OnDestroy {
  email = '';
  password = '';
  private backButtonSubscription: any;

  constructor(
    private readonly api: ApiService,
    private readonly store: Store,
    private readonly router: Router,
    private readonly toastController: ToastController,
    private readonly translate: TranslateService, // Inject TranslateService
    private readonly platform: Platform
  ) {}

  async showToast(messageKey: string) {
    const message = await this.translate.get(messageKey).toPromise();
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top'
    });
    await toast.present();
  }

  login() {
    if (!this.email || !this.password) {
      this.showToast('LOGIN.VALIDATION.REQUIRED');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.showToast('LOGIN.VALIDATION.INVALID_EMAIL');
      return;
    }

    this.api.login(this.email, this.password).subscribe({
      next: user => {
        this.store.dispatch(loginSuccess({ user }));
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.showToast('LOGIN.ERROR.FAILED');
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

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
  goToSignup() {
    this.router.navigate(['/signup']);
  }
}