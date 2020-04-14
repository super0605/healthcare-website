import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ThemeService } from '@medopad/shared/theme';

@Injectable()
export class ClinicianService {
  constructor(
    private themeService: ThemeService,
    private httpClient: HttpClient
  ) {}

  test(): Promise<any> {
    return new Promise(resolve => {
      resolve(null);
    });
  }
}
