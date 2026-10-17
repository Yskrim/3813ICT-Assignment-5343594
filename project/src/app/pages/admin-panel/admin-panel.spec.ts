import { testProviders, loginAs } from '../../../testing/test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPanelPage } from './admin-panel';

describe('AdminPanelPage', () => {
  let component: AdminPanelPage;
  let fixture: ComponentFixture<AdminPanelPage>;

  beforeEach(async () => {
    loginAs();
    await TestBed.configureTestingModule({
      imports: [AdminPanelPage],
      providers: testProviders,
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPanelPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
