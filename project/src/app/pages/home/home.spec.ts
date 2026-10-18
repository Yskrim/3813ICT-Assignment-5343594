import { testProviders, loginAs } from '../../../testing/test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    loginAs();
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: testProviders,
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
