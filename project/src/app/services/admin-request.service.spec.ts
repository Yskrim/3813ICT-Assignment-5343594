import { testProviders, loginAs } from '../../testing/test-providers';
import { TestBed } from '@angular/core/testing';
import { AdminRequestService } from './admin-request.service';

describe('AdminRequestService', () => {
	let service: AdminRequestService;

	beforeEach(() => {
		loginAs();
		TestBed.configureTestingModule({ providers: testProviders });
		service = TestBed.inject(AdminRequestService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
