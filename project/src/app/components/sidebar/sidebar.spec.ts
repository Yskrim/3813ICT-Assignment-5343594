import { loginAs, testProviders } from '../../../testing/test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sidebar } from './sidebar';
import { Channel, Group } from '../../models';

import { HttpTestingController } from '@angular/common/http/testing';

// presentational component: give inputs, check what is rendered ---
const GROUPS: Group[] = [
	{ id: '1', name: 'Group A', adminIds: [], memberIds: [] } as unknown as Group,
	{ id: '2', name: 'Group B', adminIds: [], memberIds: [] } as unknown as Group,
];
const CHANNELS: Record<string, Channel[]> = {
	'1': [{ id: '10', name: 'general', groupId: '1' } as unknown as Channel],
	'2': [],
};

describe('Sidebar', () => {
	let fixture: ComponentFixture<Sidebar>;
	let el: HTMLElement;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [Sidebar],
			providers: testProviders,
		}).compileComponents();

		fixture = TestBed.createComponent(Sidebar);
		// required inputs must be set before first render
		fixture.componentRef.setInput('groups', GROUPS);
		fixture.componentRef.setInput('channelsByGroup', CHANNELS);
		await fixture.whenStable();
		el = fixture.nativeElement;
	});

	it('renders every group name', () => {
		expect(el.textContent).toContain('Group A');
		expect(el.textContent).toContain('Group B');
	});

	it('renders channels of a group', () => {
		expect(el.textContent).toContain('general');
	});

	it('shows empty text for group without channels', () => {
		expect(el.textContent).toContain('No channels yet');
	});

	it('shows empty text when user has no groups', async () => {
		fixture.componentRef.setInput('groups', []);
		await fixture.whenStable();
		expect(el.textContent).toContain('You are not in any group yet.');
	});
});

// search ---
describe('Sidebar search', () => {
	let fixture: ComponentFixture<Sidebar>;
	let el: HTMLElement;
	let http: HttpTestingController;

    beforeEach(async () => {
        loginAs(); // join needs current user id
        await TestBed.configureTestingModule({
			imports: [Sidebar],
			providers: testProviders,
		}).compileComponents();

		fixture = TestBed.createComponent(Sidebar);
		fixture.componentRef.setInput('groups', GROUPS);
		fixture.componentRef.setInput('channelsByGroup', CHANNELS);
		await fixture.whenStable();
		el = fixture.nativeElement;
		http = TestBed.inject(HttpTestingController);
	});

	// type text, wait for debounce, answer fake server
	async function searchFor(q: string, answer: Group[]) {
		fixture.componentInstance.query.set(q);
		await fixture.whenStable();
		await new Promise((r) => setTimeout(r, 350));
		http.expectOne((r) => r.url === '/api/groups' && r.params.get('q') === q).flush(answer);
		await fixture.whenStable();
	}

	it('shows Join for other groups and joined badge for mine', async () => {
		const other = { id: '3', name: 'Music club', adminIds: [], memberIds: [] } as unknown as Group;
		await searchFor('a', [GROUPS[0], other]);

		expect(el.textContent).toContain('Music club');
		expect(el.textContent).toContain('joined');
		expect(el.querySelectorAll('button').length).toBe(1);
	});

	it('join posts userId and tells parent', async () => {
		const other = { id: '3', name: 'Music club', adminIds: [], memberIds: [] } as unknown as Group;
		let joined = false;
		fixture.componentInstance.joined.subscribe(() => (joined = true));
		await searchFor('music', [other]);

		(el.querySelector('button') as HTMLButtonElement).click();
		const req = http.expectOne('/api/groups/3/join');
		expect(req.request.body).toEqual({ userId: '1' });
		req.flush(other);

		expect(joined).toBe(true);
		expect(fixture.componentInstance.query()).toBe('');
	});
});
