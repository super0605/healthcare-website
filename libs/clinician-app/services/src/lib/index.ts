export * from '@medopad/shared/services';

export const API_ENDPOINTS = {
  patients: 'https://api.jsonbin.io/b/5e8c71a7e583106bbe33b8af',
  currentPatient: 'https://api.jsonbin.io/b/5e8c71fcff9c906bdf1d6d58',
  clinicians: 'https://api.jsonbin.io/b/5e8c8016ff9c906bdf1d7631'
};

export { ClinicianService } from './clinician-app-services';
