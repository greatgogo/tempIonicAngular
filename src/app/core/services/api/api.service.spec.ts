import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { User } from '../../models/user.model';
import { environment } from '../../../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  const mockUser: User = { id: 1, name: 'John Doe', email: 'test@example.com' };

  // Set up the testing module and inject dependencies before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Test service creation
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test login method: should make a POST request and return a user
  it('should return a user on login', () => {
    service.login('test@example.com', 'password123').subscribe((user: User) => {
      expect(user).toEqual(mockUser);
    });

    // Match the exact URL as used in ApiService for login
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@example.com', password: 'password123' });
    req.flush(mockUser); // Mocked user response
  });

  // Test login method: should handle API error
  it('should handle error on login', () => {
    service.login('test@example.com', 'password123').subscribe({
      next: () => fail('should have errored'),
      error: (err) => {
        expect(err.status).toBe(401);
      }
    });
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/login`);
    req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
  });

  // Test logout method: should make a POST request and return null
  it('should call logout and return null', () => {
    service.logout().subscribe(response => {
      expect(response).toBeNull();
    });
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/logout`);
    expect(req.request.method).toBe('POST');
    req.flush(null); // Mocked null response
  });

  // Test GET method
  it('should get data from API', () => {
    const mockResponse = { id: 1, name: 'Sample Data' };

    service.get('data').subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/data`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse); // Mocked data response
  });

  // Test POST method
  it('should post data to API', () => {
    const postData = { title: 'Test Data' };

    service.post('data', postData).subscribe((data) => {
      expect(data).toEqual(postData);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/data`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(postData);
    req.flush(postData); // Mocked post response
  });

  // Test PUT method
  it('should update data using PUT method', () => {
    const updateData = { title: 'Updated Data' };

    service.put('data/1', updateData).subscribe((data) => {
      expect(data).toEqual(updateData);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/data/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateData);
    req.flush(updateData); // Mocked put response
  });

  // Test PATCH method
  it('should partially update data using PATCH method', () => {
    const patchData = { title: 'Partially Updated Data' };

    service.patch('data/1', patchData).subscribe((data) => {
      expect(data).toEqual(patchData);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/data/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(patchData);
    req.flush(patchData); // Mocked patch response
  });

  // Test DELETE method
  it('should delete data using DELETE method', () => {
    service.delete('data/1').subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/data/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({}); // Mocked delete response
  });

  // Test updateProfile method: should make a PUT request and return updated user
  it('should update user profile', () => {
    const updateData = { name: 'Jane', email: 'jane@example.com', phone: '1234567890' };
    const updatedUser: User = { id: 1, name: 'Jane', email: 'jane@example.com' };
    service.updateProfile(updateData).subscribe((user) => {
      expect(user).toEqual(updatedUser);
    });
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/users/me`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateData);
    req.flush(updatedUser);
  });

  // Test updateProfile method: should handle API error
  it('should handle error on updateProfile', () => {
    const updateData = { name: 'Jane', email: 'jane@example.com', phone: '1234567890' };
    service.updateProfile(updateData).subscribe({
      next: () => fail('should have errored'),
      error: (err) => {
        expect(err.status).toBe(400);
      }
    });
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/users/me`);
    req.flush({ message: 'Bad Request' }, { status: 400, statusText: 'Bad Request' });
  });

  // Verify that there are no outstanding HTTP requests after each test
  afterEach(() => {
    httpMock.verify();
  });
});
