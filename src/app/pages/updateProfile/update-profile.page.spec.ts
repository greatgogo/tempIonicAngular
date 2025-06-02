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
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ApiService } from '../../core/services/api/api.service';
import { of, throwError } from 'rxjs';

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
});
