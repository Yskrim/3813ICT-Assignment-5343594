import { testProviders, loginAs } from '../../../testing/test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfileSettings } from './user-profile-settings';

describe('UserProfileSettings', () => {
  let component: UserProfileSettings;
  let fixture: ComponentFixture<UserProfileSettings>;

  beforeEach(async () => {
    loginAs();
    await TestBed.configureTestingModule({
      imports: [UserProfileSettings],
      providers: testProviders,
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
