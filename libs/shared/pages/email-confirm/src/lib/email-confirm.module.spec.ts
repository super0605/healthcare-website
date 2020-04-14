import { async, TestBed } from '@angular/core/testing';
import { EmailConfirmModule } from './email-confirm.module';

describe('EmailConfirmModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [EmailConfirmModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EmailConfirmModule).toBeDefined();
  });
});
