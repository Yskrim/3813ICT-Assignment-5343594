import { testProviders, loginAs } from '../../../testing/test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfile } from './user-profile';

describe('UserProfile', () => {
  let component: UserProfile;
  let fixture: ComponentFixture<UserProfile>;

  beforeEach(async () => {
    loginAs();
    await TestBed.configureTestingModule({
      imports: [UserProfile],
      providers: testProviders,
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
