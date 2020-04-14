import { async, TestBed } from '@angular/core/testing';
import { ResetPasswordModule } from './reset-password.module';

describe('SharedPagesResetPasswordModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ResetPasswordModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ResetPasswordModule).toBeDefined();
  });
});
