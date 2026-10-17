import { testProviders, loginAs } from '../../testing/test-providers';
import { TestBed } from '@angular/core/testing';
import { SocketService } from './socket.service';

describe('SocketService', () => {
	let service: SocketService;

	beforeEach(() => {
		loginAs();
		TestBed.configureTestingModule({ providers: testProviders });
		service = TestBed.inject(SocketService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
