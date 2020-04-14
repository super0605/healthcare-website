import { async, TestBed } from '@angular/core/testing';
import { SignupModule } from './signup.module';

describe('SignupModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SignupModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SignupModule).toBeDefined();
  });
});
