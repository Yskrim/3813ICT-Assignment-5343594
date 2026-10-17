import { testProviders, loginAs } from '../testing/test-providers';
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    loginAs();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: testProviders,
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
