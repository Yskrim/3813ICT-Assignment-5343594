import { testProviders, loginAs } from '../../../testing/test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupInfo } from './group-info';

describe('GroupInfo', () => {
  let component: GroupInfo;
  let fixture: ComponentFixture<GroupInfo>;

  beforeEach(async () => {
    loginAs();
    await TestBed.configureTestingModule({
      imports: [GroupInfo],
      providers: testProviders,
    }).compileComponents();

    fixture = TestBed.createComponent(GroupInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
