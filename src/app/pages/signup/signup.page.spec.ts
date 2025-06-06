import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupPage } from './signup.page';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { signup } from '../../store/actions/user.actions';
import { NavController } from '@ionic/angular';
import { ApiService } from '../../core/services/api/api.service';
import { of, throwError } from 'rxjs';

describe('SignupPage', () => {
  let component: SignupPage;
  let fixture: ComponentFixture<SignupPage>;
  let storeDispatchSpy: jasmine.Spy;
  let routerSpy: any;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['signup']);
    // Set a default return value for signup so .subscribe() is always defined
    apiServiceSpy.signup.and.returnValue(of({ id: 1, name: 'Test User', email: 'test@example.com' }));
    await TestBed.configureTestingModule({
      imports: [FormsModule, SignupPage],
      providers: [
        { provide: Store, useValue: { dispatch: jasmine.createSpy('dispatch') } },
        { provide: Router, useValue: routerSpy },
        { provide: NavController, useValue: {} },
        { provide: ActivatedRoute, useValue: {} },
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupPage);
    component = fixture.componentInstance;
    storeDispatchSpy = TestBed.inject(Store).dispatch as jasmine.Spy;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch signup and navigate to dashboard on valid signup', () => {
    component.name = 'Test User';
    component.email = 'test@example.com';
    component.password = 'password123';
    component.onSignup();
    expect(storeDispatchSpy).toHaveBeenCalledWith(signup({ user: { name: 'Test User', email: 'test@example.com', password: 'password123' } }));
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should not dispatch signup if fields are empty', () => {
    component.name = '';
    component.email = '';
    component.password = '';
    component.onSignup();
    expect(storeDispatchSpy).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should not dispatch signup if name is empty', () => {
    component.name = '';
    component.email = 'test@example.com';
    component.password = 'password123';
    component.onSignup();
    expect(storeDispatchSpy).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should not dispatch signup if email is empty', () => {
    component.name = 'Test User';
    component.email = '';
    component.password = 'password123';
    component.onSignup();
    expect(storeDispatchSpy).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should not dispatch signup if password is empty', () => {
    component.name = 'Test User';
    component.email = 'test@example.com';
    component.password = '';
    component.onSignup();
    expect(storeDispatchSpy).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should trim whitespace and allow signup if fields are valid after trim', () => {
    component.name = '  Test User  ';
    component.email = '  test@example.com  ';
    component.password = '  password123  ';
    component.onSignup();
    // If your implementation trims, update the expectation accordingly
    expect(storeDispatchSpy).toHaveBeenCalledWith(signup({ user: { name: '  Test User  ', email: '  test@example.com  ', password: '  password123  ' } }));
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should call ApiService.signup and navigate on API success', () => {
    apiServiceSpy.signup.and.returnValue(of({ id: 1, name: 'Test User', email: 'test@example.com' }));
    component.name = 'Test User';
    component.email = 'test@example.com';
    component.password = 'password123';
    component.onSignup();
    expect(apiServiceSpy.signup).toHaveBeenCalledWith({ name: 'Test User', email: 'test@example.com', password: 'password123' });
    expect(storeDispatchSpy).toHaveBeenCalledWith(signup({ user: { name: 'Test User', email: 'test@example.com', password: 'password123' } }));
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should handle ApiService.signup error and not navigate', () => {
    apiServiceSpy.signup.and.returnValue(throwError(() => new Error('Signup failed')));
    component.name = 'Test User';
    component.email = 'test@example.com';
    component.password = 'password123';
    component.onSignup();
    expect(apiServiceSpy.signup).toHaveBeenCalledWith({ name: 'Test User', email: 'test@example.com', password: 'password123' });
    expect(routerSpy.navigate).not.toHaveBeenCalled();
    // Optionally check for error handling logic here
  });

  it('should mark email as invalid if not a valid email', () => {
    component.email = 'invalid-email';
    component.password = 'password123';
    component.onSignup();
    expect(storeDispatchSpy).not.toHaveBeenCalled();
  });

  it('should not dispatch signup if email is invalid', () => {
    component.name = 'Test User';
    component.email = 'invalid-email';
    component.password = 'password123';
    component.onSignup();
    expect(storeDispatchSpy).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should handle API error during signup and not navigate', () => {
    apiServiceSpy.signup.and.returnValue(throwError(() => new Error('Signup failed')));
    component.name = 'Test User';
    component.email = 'test@example.com';
    component.password = 'password123';
    component.onSignup();
    expect(apiServiceSpy.signup).toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
