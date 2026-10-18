import { testProviders, loginAs } from '../../testing/test-providers';
import { TestBed } from '@angular/core/testing';
import { GroupService } from './group.service';

describe('GroupService', () => {
	let service: GroupService;

	beforeEach(() => {
		loginAs();
		TestBed.configureTestingModule({ providers: testProviders });
		service = TestBed.inject(GroupService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
