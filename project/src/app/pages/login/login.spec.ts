import { testProviders, loginAs } from '../../../testing/test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async () => {
    loginAs();
    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: testProviders,
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
