import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let storage: StorageService;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    TestBed.configureTestingModule({});
    storage = TestBed.inject(StorageService);
  });

  it('saves and reads back an object', () => {
    storage.set('prefs', { theme: 'dark' });
    expect(storage.get<{ theme: string }>('prefs')).toEqual({ theme: 'dark' });
  });

  it('returns null for missing key', () => {
    expect(storage.get('nothing')).toBeNull();
  });

  it('returns null for broken json instead of throwing', () => {
    localStorage.setItem('broken', '{not json');
    expect(storage.get('broken')).toBeNull();
  });

  it('removes a key', () => {
    storage.set('prefs', { theme: 'dark' });
    storage.remove('prefs');
    expect(storage.get('prefs')).toBeNull();
  });

  it('can use sessionStorage instead of localStorage', () => {
    storage.set('tab', 1, sessionStorage);
    expect(storage.get('tab', sessionStorage)).toBe(1);
    expect(storage.get('tab')).toBeNull();
  });
});
