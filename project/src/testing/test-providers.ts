import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { User } from '../app/models';

// fake logged in user for tests ---
export const TEST_USER: User = {
	id: '1',
	username: 'korton',
	role: 'superAdmin',
	displayName: 'Test User',
	groupIds: ['1'],
	dateOfBirth: '2002-01-01',
};

// AuthService reads user from localStorage on start -> put it there before TestBed creates it
export function loginAs(user: User | null = TEST_USER): void {
	if (user) localStorage.setItem('currentUser', JSON.stringify(user));
	else localStorage.removeItem('currentUser');
}

// same providers for every component test: http without real server + router
export const testProviders = [provideHttpClient(), provideHttpClientTesting(), provideRouter([])];
