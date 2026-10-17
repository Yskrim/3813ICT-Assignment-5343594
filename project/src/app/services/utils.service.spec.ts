import { testProviders, loginAs } from '../../testing/test-providers';
import { TestBed } from '@angular/core/testing';
import { UtilsService } from './utils.service';

describe('UtilsService', () => {
	let service: UtilsService;

	beforeEach(() => {
		loginAs();
		TestBed.configureTestingModule({ providers: testProviders });
		service = TestBed.inject(UtilsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
