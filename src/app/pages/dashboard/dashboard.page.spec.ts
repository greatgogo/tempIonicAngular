import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPage } from './dashboard.page';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { logout } from '../../store/actions/user.actions';

// Unit tests for the DashboardPage component
//
// This test suite verifies:
// - Component creation
// - Logout: dispatches logout action and navigates to login
//
// Mocks are used for Store and Router to isolate component logic.

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;
  let store: MockStore;
  let routerSpy: jasmine.SpyObj<Router>;

  // Set up the testing module and spies before each test
  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [DashboardPage],
      providers: [
        provideMockStore({}),
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test that the DashboardPage component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test logout: should dispatch logout action and navigate to login
  it('should dispatch logout and navigate to login', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.logout();
    expect(dispatchSpy).toHaveBeenCalledWith(logout());
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  // Test logout: should not navigate if dispatch throws error
  it('should not navigate if dispatch throws error', () => {
    spyOn(store, 'dispatch').and.throwError('Dispatch error');
    expect(() => component.logout()).toThrowError('Dispatch error');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  // Test logout: should log an error if logout dispatch fails
  it('should log an error if logout dispatch fails', () => {
    spyOn(console, 'error');
    spyOn(store, 'dispatch').and.throwError('Dispatch error');
    expect(() => component.logout()).toThrowError('Dispatch error');
    expect(console.error).toHaveBeenCalledWith('Dispatch error');
  });
});