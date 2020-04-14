import { async, TestBed } from '@angular/core/testing';
import { ClinicianProfileModule } from './clinician-profile.module';

describe('ClinicianProfileModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ClinicianProfileModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ClinicianProfileModule).toBeDefined();
  });
});
