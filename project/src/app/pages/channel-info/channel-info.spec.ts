import { testProviders, loginAs } from '../../../testing/test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChannelInfo } from './channel-info';

describe('ChannelInfo', () => {
  let component: ChannelInfo;
  let fixture: ComponentFixture<ChannelInfo>;

  beforeEach(async () => {
    loginAs();
    await TestBed.configureTestingModule({
      imports: [ChannelInfo],
      providers: testProviders,
    }).compileComponents();

    fixture = TestBed.createComponent(ChannelInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
