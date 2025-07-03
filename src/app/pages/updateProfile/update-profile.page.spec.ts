// Unit tests for the UpdateProfilePage standalone component
//
// This test suite verifies:
// - Component creation
// - Successful form submission: calls ApiService.updateProfile, dispatches updateUser, and navigates to dashboard
// - Invalid form submission: does not call ApiService or dispatch or navigate

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { UpdateProfilePage } from './update-profile.page';
import { updateUser } from '../../store/actions/user.actions';
import { ApiService } from '../../core/services/api/api.service';
import { of, throwError } from 'rxjs';
import { Camera } from '@capacitor/camera';
import { Device } from '@capacitor/device';
import { TranslateService } from '@ngx-translate/core';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

/// <reference types="jasmine" />

describe('UpdateProfilePage', () => {
  let component: UpdateProfilePage;
  let fixture: ComponentFixture<UpdateProfilePage>;
  let storeDispatchSpy: jasmine.Spy;
  let routerSpy: jasmine.SpyObj<Router>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['updateProfile']);
    // Mock the updateProfile API response with a realistic user object
    apiServiceSpy.updateProfile.and.returnValue(of({ id: 1, name: 'Test User', email: 'test@example.com', phone: '1234567890' }));

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, UpdateProfilePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jasmine.createSpy('dispatch'),
          },
        },
        { provide: Router, useValue: routerSpy },
        { provide: ApiService, useValue: apiServiceSpy },
        TranslateService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    storeDispatchSpy = TestBed.inject(Store).dispatch as jasmine.Spy;
  });

  // Test component creation
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test valid form submission: should call updateProfile, dispatch updateUser, and navigate
  it('should call ApiService.updateProfile, dispatch updateUser, and navigate to dashboard on valid form submit', () => {
    component.updateForm.setValue({
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
    });
    component.onSubmit();
    expect(apiServiceSpy.updateProfile).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
    });
    expect(storeDispatchSpy).toHaveBeenCalledWith(updateUser({
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
    }));
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  // Test invalid form submission: should not call updateProfile, dispatch, or navigate
  it('should not dispatch updateUser or navigate if form is invalid', () => {
    component.updateForm.setValue({
      name: '',
      email: 'invalid',
      phone: '',
    });
    component.onSubmit();
    expect(storeDispatchSpy).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  // Test form submission with only name missing
  it('should not call updateProfile, dispatch, or navigate if name is missing', () => {
    component.updateForm.setValue({
      name: '',
      email: 'test@example.com',
      phone: '1234567890',
    });
    component.onSubmit();
    expect(apiServiceSpy.updateProfile).not.toHaveBeenCalled();
    expect(storeDispatchSpy).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  // Test form submission with only email missing
  it('should not call updateProfile, dispatch, or navigate if email is missing', () => {
    component.updateForm.setValue({
      name: 'Test User',
      email: '',
      phone: '1234567890',
    });
    component.onSubmit();
    expect(apiServiceSpy.updateProfile).not.toHaveBeenCalled();
    expect(storeDispatchSpy).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  // Test form submission with only phone missing
  it('should not call updateProfile, dispatch, or navigate if phone is missing', () => {
    component.updateForm.setValue({
      name: 'Test User',
      email: 'test@example.com',
      phone: '',
    });
    component.onSubmit();
    expect(apiServiceSpy.updateProfile).not.toHaveBeenCalled();
    expect(storeDispatchSpy).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  // Test form submission with all fields whitespace
  it('should not call updateProfile, dispatch, or navigate if all fields are whitespace', () => {
    component.updateForm.setValue({
      name: '   ',
      email: '   ',
      phone: '   ',
    });
    component.onSubmit();
    expect(apiServiceSpy.updateProfile).not.toHaveBeenCalled();
    expect(storeDispatchSpy).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  // Test form submission with special characters in fields
  it('should call updateProfile with special characters in fields', () => {
    component.updateForm.setValue({
      name: 'Test!@#',
      email: 'test+user@example.com',
      phone: '+1-800-555-0199',
    });
    component.onSubmit();
    expect(apiServiceSpy.updateProfile).toHaveBeenCalledWith({
      name: 'Test!@#',
      email: 'test+user@example.com',
      phone: '+1-800-555-0199',
    });
    expect(storeDispatchSpy).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  // Test multiple valid submissions
  it('should allow multiple valid submissions', () => {
    component.updateForm.setValue({
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
    });
    component.onSubmit();
    component.onSubmit();
    expect(apiServiceSpy.updateProfile).toHaveBeenCalledTimes(2);
    expect(storeDispatchSpy).toHaveBeenCalledTimes(2);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  // Test error handling: simulate error and check for error handling logic (if any)
  it('should handle error and allow retry', () => {
    apiServiceSpy.updateProfile.and.returnValue(throwError(() => new Error('Update failed')));
    component.updateForm.setValue({
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
    });
    component.onSubmit();
    expect(storeDispatchSpy).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();

    // Now simulate a successful retry
    apiServiceSpy.updateProfile.and.returnValue(of({ id: 2, name: 'Test User', email: 'test@example.com', phone: '1234567890' }));
    component.onSubmit();
    expect(storeDispatchSpy).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  // Test form control validation
  it('should mark name as invalid if empty', () => {
    const nameControl = component.updateForm.get('name');
    nameControl?.setValue('');
    expect(nameControl?.valid).toBeFalse();
  });

  it('should mark email as invalid if not a valid email', () => {
    const emailControl = component.updateForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalse();
  });

  it('should mark phone as invalid if empty', () => {
    const phoneControl = component.updateForm.get('phone');
    phoneControl?.setValue('');
    expect(phoneControl?.valid).toBeFalse();
  });

  // Test error handling during API call
  it('should display an error message if API call fails', () => {
    spyOn(window.console, 'error'); // Mock console.error
    apiServiceSpy.updateProfile.and.returnValue(throwError(() => new Error('API error')));
    component.updateForm.setValue({
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
    });
    component.onSubmit();
    expect(console.error).toHaveBeenCalledWith('API error');
  });

  it('should upload profile image from camera', async () => {
    spyOn(Camera, 'getPhoto').and.returnValue(Promise.resolve({ dataUrl: 'camera-image-url' } as any));
    await component.uploadFromCamera();
    expect(component.profileImage).toBe('camera-image-url');
  });

  it('should upload profile image from gallery', async () => {
    spyOn(Camera, 'getPhoto').and.returnValue(Promise.resolve({ dataUrl: 'gallery-image-url' } as any));
    await component.uploadFromGallery();
    expect(component.profileImage).toBe('gallery-image-url');
  });

  it('should show confirmation modal before submitting', async () => {
    const modalSpy = spyOn(component['modalController'], 'create').and.callThrough();
    await component.showConfirmationModal();
    expect(modalSpy).toHaveBeenCalled();
  });

  // Test language initialization
  it('should initialize language to device language or default to English', async () => {
    spyOn(Device, 'getLanguageCode').and.returnValue(Promise.resolve({ value: 'es-ES' }));
    spyOn(component.translate, 'use');
    await component.initializeLanguage();
    expect(component.selectedLanguage).toBe('es');
    expect(component.translate.use).toHaveBeenCalledWith('es');
  });

  it('should default to English if device language is unsupported', async () => {
    spyOn(Device, 'getLanguageCode').and.returnValue(Promise.resolve({ value: 'fr-FR' }));
    spyOn(component.translate, 'use');
    await component.initializeLanguage();
    expect(component.selectedLanguage).toBe('en');
    expect(component.translate.use).toHaveBeenCalledWith('en');
  });

  // Test language change
  it('should change language when a new language is selected', () => {
    spyOn((component as any).translate, 'use');
    component.changeLanguage('es');
    expect(component.selectedLanguage).toBe('es');
    expect((component as any).translate.use).toHaveBeenCalledWith('es');
  });

  // Test confirmation modal
  // it('should show confirmation modal with translated content', async () => {
  //   spyOn(component.translate, 'get').and.callFake((key: string) => {
  //     const translations = {
  //       'UPDATE_PROFILE.CONFIRM_UPDATE.TITLE': 'Confirmar Actualización',
  //       'UPDATE_PROFILE.CONFIRM_UPDATE.MESSAGE': '¿Estás seguro de que deseas actualizar tu perfil?',
  //       'UPDATE_PROFILE.CONFIRM_UPDATE.CONFIRM_TEXT': 'Sí',
  //       'UPDATE_PROFILE.CONFIRM_UPDATE.CANCEL_TEXT': 'No'
  //     };
  //     return Promise.resolve(translations[key as keyof typeof translations]);
  //   });
  //   const modalSpy = spyOn(component['modalController'], 'create').and.callThrough();
  //   await component.showConfirmationModal();
  //   expect(modalSpy).toHaveBeenCalled();
  // });
});
