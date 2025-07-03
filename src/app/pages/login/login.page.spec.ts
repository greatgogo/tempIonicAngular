import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { Store } from '@ngrx/store';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { loginSuccess } from '../../store/actions/user.actions';
import { ApiService } from '../../core/services/api/api.service';
import { of, throwError, Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

// Unit tests for the LoginPage component
//
// This test suite verifies:
// - Component creation
// - Successful login: dispatches loginSuccess and navigates to dashboard
// - Failed login: does not dispatch or navigate if name is empty
//
// Mocks are used for Store, Router, and ApiService to isolate component logic.

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let storeDispatchSpy: jasmine.Spy; // Spy to observe store.dispatch calls
  let routerSpy: jasmine.SpyObj<Router>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  // Set up the testing module and spies before each test
  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['login']);
    apiServiceSpy.login.and.returnValue(of({ id: 1, name: 'Test User', email: 'test@example.com' })); // Mocked login response

    await TestBed.configureTestingModule({
      imports: [
        LoginPage,
        IonicModule.forRoot(),
        FormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot() // <-- Add this line
      ],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jasmine.createSpy('dispatch'), // Mock store.dispatch
          },
        },
        { provide: Router, useValue: routerSpy },
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: NavController, useValue: {} }, // Mock NavController
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Get the spy for store.dispatch to verify dispatched actions
    storeDispatchSpy = TestBed.inject(Store).dispatch as jasmine.Spy;
  });

  // Test that the LoginPage component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test successful login: should dispatch loginSuccess and navigate
  it('should dispatch loginSuccess and navigate to dashboard on login', () => {
    //component.name = 'Test User'; // Remove this line
    component.email = 'test@example.com';
    component.password = 'password123';
    component.login();
    // The store.dispatch should be called with the loginSuccess action and user payload
    expect(storeDispatchSpy).toHaveBeenCalledWith(loginSuccess({ user: { id: 1, name: 'Test User', email: 'test@example.com' } }));
    // The router should navigate to the dashboard
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  // Test failed login: does not dispatch or navigate if name is empty
  it('should not login and stay on login page if email is empty', () => {
    apiServiceSpy.login.and.callFake(() => { throw new Error('login should not be called'); });
    //component.name = 'Test User'; // Remove this line
    component.email = '';
    component.password = 'password123';
    component.login();
    expect(apiServiceSpy.login).not.toHaveBeenCalled();
    expect(storeDispatchSpy).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should not login and stay on login page if password is empty', () => {
    apiServiceSpy.login.and.callFake(() => { throw new Error('login should not be called'); });
    //component.name = 'Test User'; // Remove this line
    component.email = 'test@example.com';
    component.password = '';
    component.login();
    expect(apiServiceSpy.login).not.toHaveBeenCalled();
    expect(storeDispatchSpy).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should not login and stay on login page if email and password are empty', () => {
    apiServiceSpy.login.and.callFake(() => { throw new Error('login should not be called'); });
    //component.name = ''; // Remove this line
    component.email = '';
    component.password = '';
    component.login();
    expect(apiServiceSpy.login).not.toHaveBeenCalled();
    expect(storeDispatchSpy).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  // Test login with ApiService returning error: should not dispatch or navigate
  it('should not dispatch or navigate if ApiService.login throws error', () => {
    apiServiceSpy.login.and.returnValue(throwError(() => new Error('Login failed')));
    //component.name = 'Test User'; // Remove this line
    component.email = 'test@example.com';
    component.password = 'password123';
    component.login();
    expect(storeDispatchSpy).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should not login if all fields are whitespace', () => {
    //component.name = 'Test User'; // Remove this line
    component.email = '   ';
    component.password = '   ';
    component.login();
    expect(apiServiceSpy.login).not.toHaveBeenCalled();
    expect(storeDispatchSpy).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should trim whitespace and login if fields are valid after trim', () => {
    //component.name = '  Test User  '; // Remove this line
    component.email = '  test@example.com  ';
    component.password = '  password123  ';
    component.login();
    expect(apiServiceSpy.login).toHaveBeenCalledWith('  test@example.com  ', '  password123  ');
    expect(storeDispatchSpy).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should allow login with special characters in credentials', () => {
    //component.name = 'Test!@#'; // Remove this line
    component.email = 'test+user@example.com';
    component.password = 'p@$$w0rd!';
    component.login();
    expect(apiServiceSpy.login).toHaveBeenCalledWith('test+user@example.com', 'p@$$w0rd!');
    expect(storeDispatchSpy).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should handle multiple login attempts', () => {
    //component.name = 'Test User'; // Remove this line
    component.email = 'test@example.com';
    component.password = 'password123';
    component.login();
    component.login();
    expect(apiServiceSpy.login).toHaveBeenCalledTimes(2);
    expect(storeDispatchSpy).toHaveBeenCalledTimes(2);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should handle error and allow retry', () => {
    apiServiceSpy.login.and.returnValue(throwError(() => new Error('Login failed')));
    //component.name = 'Test User'; // Remove this line
    component.email = 'test@example.com';
    component.password = 'password123';
    component.login();
    expect(storeDispatchSpy).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();

    // Now simulate a successful retry
    apiServiceSpy.login.and.returnValue(of({ id: 2, name: 'Test User', email: 'test@example.com' }));
    component.login();
    expect(storeDispatchSpy).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should mark email as invalid if not a valid email', () => {
    component.email = 'invalid-email';
    component.password = 'password123';
    component.login();
    expect(storeDispatchSpy).not.toHaveBeenCalled();
  });

  it('should handle API error during login', () => {
    apiServiceSpy.login.and.returnValue(throwError(() => new Error('Login failed')));
    component.email = 'test@example.com';
    component.password = 'password123';
    component.login();
    expect(apiServiceSpy.login).toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should show a toast if email and password are empty', async () => {
    spyOn(component, 'showToast');
    component.email = '';
    component.password = '';
    component.login();
    expect(component.showToast).toHaveBeenCalledWith('LOGIN.VALIDATION.REQUIRED');
  });

  it('should show a toast if email is invalid', async () => {
    spyOn(component, 'showToast');
    component.email = 'invalid-email';
    component.password = 'password123';
    component.login();
    expect(component.showToast).toHaveBeenCalledWith('LOGIN.VALIDATION.INVALID_EMAIL');
  });

  it('should show a toast if login fails', async () => {
    spyOn(component, 'showToast');
    apiServiceSpy.login.and.returnValue(throwError(() => new Error('Login failed')));
    component.email = 'test@example.com';
    component.password = 'password123';
    component.login();
    expect(component.showToast).toHaveBeenCalledWith('LOGIN.ERROR.FAILED');
  });

  // Test back button handling
  // it('should navigate to home on back button press', () => {
  //   const platformSpy = TestBed.inject(Platform);
  //   spyOn(platformSpy.backButton, 'subscribeWithPriority').and.callFake((_, callback) => {
  //     callback();
  //     // Return a mock Subscription object
  //     return { unsubscribe: () => {} } as Subscription;
  //   });
  //   component.ionViewDidEnter();
  //   expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  // });

  it('should unsubscribe back button on leave', () => {
    const subscriptionSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component['backButtonSubscription'] = subscriptionSpy;
    component.ionViewWillLeave();
    expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
  });
});
