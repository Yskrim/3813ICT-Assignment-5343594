import { testProviders } from '../../../testing/test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sidebar } from './sidebar';
import { Channel, Group } from '../../models';

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
