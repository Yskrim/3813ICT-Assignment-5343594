import { testProviders, loginAs } from '../../testing/test-providers';
import { TestBed } from '@angular/core/testing';
import { ChannelService } from './channel.service';

describe('ChannelService', () => {
	let service: ChannelService;

	beforeEach(() => {
		loginAs();
		TestBed.configureTestingModule({ providers: testProviders });
		service = TestBed.inject(ChannelService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
