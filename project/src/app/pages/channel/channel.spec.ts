import { testProviders, loginAs } from '../../../testing/test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChannelPage } from './channel';

describe('ChannelPage', () => {
  let component: ChannelPage;
  let fixture: ComponentFixture<ChannelPage>;

  beforeEach(async () => {
    loginAs();
    await TestBed.configureTestingModule({
      imports: [ChannelPage],
      providers: testProviders,
    }).compileComponents();

    fixture = TestBed.createComponent(ChannelPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
