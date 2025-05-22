import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { updateUser } from '../../store/actions/user.actions';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api/api.service';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  templateUrl: './update-profile.page.html',
  styleUrls: ['./update-profile.page.scss']
})
export class UpdateProfilePage {
  updateForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store,
    private readonly router: Router,
    private readonly api: ApiService
  ) {
    this.updateForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.updateForm.valid) {
      this.api.updateProfile(this.updateForm.value).subscribe({
        next: user => {
          this.store.dispatch(updateUser({ ...this.updateForm.value }));
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          // Optionally handle error (e.g., show a message)
        }
      });
    }
  }
}
