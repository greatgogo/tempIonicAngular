import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { updateUser } from '../../store/actions/user.actions';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api/api.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CustomModalComponent } from '../../shared/components/custom-modal/custom-modal.component';
import { Device } from '@capacitor/device';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, TranslateModule, FormsModule],
  templateUrl: './update-profile.page.html',
  styleUrls: ['./update-profile.page.scss']
})
export class UpdateProfilePage {
  updateForm: FormGroup;
  profileImage: string | null = null;
  availableLanguages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' }
  ];
  selectedLanguage!: string;

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store,
    private readonly router: Router,
    private readonly api: ApiService,
    private readonly translate: TranslateService,
    private readonly modalController: ModalController // Inject ModalController
  ) {
    this.updateForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });
    this.initializeLanguage();
  }

  async initializeLanguage() {
    const deviceInfo = await Device.getLanguageCode();
    const deviceLanguage = deviceInfo.value.split('-')[0]; // Extract language code
    this.selectedLanguage = this.availableLanguages.some(lang => lang.code === deviceLanguage)
      ? deviceLanguage
      : 'en'; // Default to English if device language is not supported
    this.translate.use(this.selectedLanguage);
  }

  changeLanguage(language: string) {
    this.selectedLanguage = language;
    this.translate.use(language);
  }

  async uploadFromCamera() {
    try {
      const cameraLabel = await this.translate.get('CAMERA').toPromise();
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        promptLabelHeader: cameraLabel, // Add translated label
      });
      this.profileImage = image.dataUrl ?? null;
    } catch (error) {
      console.error('Camera error:', error);
    }
  }

  async uploadFromGallery() {
    try {
      const galleryLabel = await this.translate.get('GALLERY').toPromise();
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
        promptLabelHeader: galleryLabel, // Add translated label
      });
      this.profileImage = image.dataUrl ?? null;
    } catch (error) {
      console.error('Gallery error:', error);
    }
  }

  async showConfirmationModal() {
    const title = await this.translate.get('UPDATE_PROFILE.CONFIRM_UPDATE.TITLE').toPromise();
    const message = await this.translate.get('UPDATE_PROFILE.CONFIRM_UPDATE.MESSAGE').toPromise();
    const confirmText = await this.translate.get('UPDATE_PROFILE.CONFIRM_UPDATE.CONFIRM_TEXT').toPromise();
    const cancelText = await this.translate.get('UPDATE_PROFILE.CONFIRM_UPDATE.CANCEL_TEXT').toPromise();

    const modal = await this.modalController.create({
      component: CustomModalComponent,
      componentProps: {
        title,
        message,
        confirmText,
        cancelText
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data?.confirmed) {
      this.onSubmit();
    }
  }

  // Modify onSubmit to be called from the modal
  onSubmit() {
    if (this.updateForm.valid) {
      const formData = { ...this.updateForm.value, profileImage: this.profileImage };
      this.api.updateProfile(formData).subscribe({
        next: user => {
          this.store.dispatch(updateUser(formData));
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          // Optionally handle error (e.g., show a message)
        }
      });
    }
  }
}
