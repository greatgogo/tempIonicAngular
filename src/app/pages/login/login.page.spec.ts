import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { Store } from '@ngrx/store';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { loginSuccess } from '../../store/actions/user.actions';
import { ApiService } from '../../core/services/api/api.service';
import { of } from 'rxjs';

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
      imports: [LoginPage, IonicModule.forRoot(), FormsModule, HttpClientTestingModule],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jasmine.createSpy('dispatch'), // Mock store.dispatch
          },
        },
        { provide: Router, useValue: routerSpy },
        { provide: ApiService, useValue: apiServiceSpy },
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
    component.name = 'Test User';
    component.email = 'test@example.com';
    component.password = 'password123';
    component.login();
    // The store.dispatch should be called with the loginSuccess action and user payload
    expect(storeDispatchSpy).toHaveBeenCalledWith(loginSuccess({ user: { id: 1, name: 'Test User', email: 'test@example.com' } }));
    // The router should navigate to the dashboard
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  // Test failed login: does not dispatch or navigate if name is empty
  it('should not login and stay on login page if name is empty', () => {
    component.name = '';
    component.login();
    // The store.dispatch should not be called if name is empty
    expect(storeDispatchSpy).not.toHaveBeenCalled();
    // The router should not navigate if name is empty
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  // Test login with missing email: should not dispatch or navigate
  it('should not login and stay on login page if email is empty', () => {
    component.name = 'Test User';
    component.email = '';
    component.password = 'password123';
    component.login();
    expect(storeDispatchSpy).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  // Test login with missing password: should not dispatch or navigate
  it('should not login and stay on login page if password is empty', () => {
    component.name = 'Test User';
    component.email = 'test@example.com';
    component.password = '';
    component.login();
    expect(storeDispatchSpy).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  // Test login with both name and email empty: should not dispatch or navigate
  it('should not login and stay on login page if name and email are empty', () => {
    component.name = '';
    component.email = '';
    component.password = 'password123';
    component.login();
    expect(storeDispatchSpy).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  // Test login with ApiService returning error: should not dispatch or navigate
  it('should not dispatch or navigate if ApiService.login throws error', () => {
    apiServiceSpy.login.and.returnValue({
      subscribe: ({ next, error }: any) => {
        if (error) error(new Error('Login failed'));
      }
    } as any);
    component.name = 'Test User';
    component.email = 'test@example.com';
    component.password = 'password123';
    component.login();
    expect(storeDispatchSpy).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
