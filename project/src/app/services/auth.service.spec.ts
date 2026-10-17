import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { testProviders, loginAs, TEST_USER } from '../../testing/test-providers';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let http: HttpTestingController;

  // create service after localStorage is prepared, it reads user on start
  function createService(): AuthService {
    TestBed.configureTestingModule({ providers: testProviders });
    http = TestBed.inject(HttpTestingController);
    return TestBed.inject(AuthService);
  }

  afterEach(() => http.verify()); // no unexpected requests left

  it('restores logged in user from storage', () => {
    loginAs(TEST_USER);
    const auth = createService();
    expect(auth.currentUser()?.id).toBe('1');
    expect(auth.isLoggedIn()).toBe(true);
  });

  it('hasRole checks role of current user', () => {
    loginAs({ ...TEST_USER, role: 'user' });
    const auth = createService();
    expect(auth.hasRole('user')).toBe(true);
    expect(auth.hasRole('groupAdmin', 'superAdmin')).toBe(false);
  });

  it('login stores user from server answer', () => {
    loginAs(null);
    const auth = createService();

    auth.login('korton', '123').subscribe();
    const req = http.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(TEST_USER);

    expect(auth.currentUser()?.username).toBe('korton');
    expect(localStorage.getItem('currentUser')).not.toBeNull();
  });

  it('login with wrong credentials gives null and keeps user logged out', () => {
    loginAs(null);
    const auth = createService();
    let result: unknown = 'not called';

    auth.login('korton', 'wrong').subscribe((u) => (result = u));
    http.expectOne('/api/auth/login').flush({ error: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });

    expect(result).toBeNull();
    expect(auth.isLoggedIn()).toBe(false);
  });

  it('logout clears user and storage', () => {
    loginAs(TEST_USER);
    const auth = createService();
    auth.logout();
    expect(auth.currentUser()).toBeNull();
    expect(localStorage.getItem('currentUser')).toBeNull();
  });
});
