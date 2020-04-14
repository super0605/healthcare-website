import { Injectable, Inject, Optional } from '@angular/core';
import { ThemeService } from '@medopad/shared/theme';
import { ApiService } from '../apiClient/api.service';
import { API_ENDPOINTS } from '../endpoints';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StartupService {
  constructor(
    private api: ApiService,
    @Inject('API_ENDPOINTS') @Optional() public apiEndpoints?: object
  ) {
    this.apiEndpoints = API_ENDPOINTS;
  }

  initialize(param: any): Promise<any> {
    return new Promise(resolve => {
      console.log('LOAD action called');
      this.apiEndpoints = param;

      resolve(null);
    });
  }

  getPatients(): Observable<{ data: any }> {
    return this.api.get(this.apiEndpoints['patients']);
  }

  getMyPatients(): Observable<{ data: any }> {
    return this.api.get(this.apiEndpoints['patients']);
  }

  getCurrentPatient(id) {
    console.log(id);
    return this.api.get(this.apiEndpoints['currentPatient']);
  }

  getClinicians(): Observable<{ data: any }> {
    return this.api.get(this.apiEndpoints['clinicians']);
  }
}
