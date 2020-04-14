import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicianProfileComponent } from './clinician-profile.component';

describe('ClinicianProfileComponent', () => {
  let component: ClinicianProfileComponent;
  let fixture: ComponentFixture<ClinicianProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClinicianProfileComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicianProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
