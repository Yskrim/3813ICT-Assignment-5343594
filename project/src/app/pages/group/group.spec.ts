import { testProviders, loginAs } from '../../../testing/test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupPage } from './group';

describe('GroupPage', () => {
  let component: GroupPage;
  let fixture: ComponentFixture<GroupPage>;

  beforeEach(async () => {
    loginAs();
    await TestBed.configureTestingModule({
      imports: [GroupPage],
      providers: testProviders,
    }).compileComponents();

    fixture = TestBed.createComponent(GroupPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
