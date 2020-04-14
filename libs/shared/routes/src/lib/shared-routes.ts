import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  DefaultLayoutComponent,
  FullScreenLayoutComponent
} from '@medopad/shared/layouts';

const sharedRoutes: Routes = [
  {
    path: 'clinicians',
    component: DefaultLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@medopad/shared/pages/clinicians-list').then(
            m => m.CliniciansListModule
          )
      }
    ]
  },
  {
    path: 'login',
    component: FullScreenLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@medopad/shared/pages/login').then(m => m.LoginModule)
      }
    ]
  },
  {
    path: 'register',
    component: FullScreenLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@medopad/shared/pages/signup').then(m => m.SignupModule)
      }
    ]
  },
  {
    path: 'email-confirm',
    component: FullScreenLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@medopad/shared/pages/email-confirm').then(
            m => m.EmailConfirmModule
          )
      }
    ]
  },
  {
    path: 'reset-password',
    component: FullScreenLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@medopad/shared/pages/reset-password').then(
            m => m.ResetPasswordModule
          )
      }
    ]
  },
  {
    path: 'patients',
    component: DefaultLayoutComponent,
    data: {
      hideSidebar: true
    },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@medopad/shared/pages/patients-list').then(
            m => m.PatientsListModule
          )
      },
      {
        path: 'my',
        loadChildren: () =>
          import('@medopad/shared/pages/patients-list').then(
            m => m.PatientsListModule
          )
      }
    ]
  },
  {
    path: 'patient',
    component: DefaultLayoutComponent,
    data: {
      hideSidebar: true
    },
    children: [
      {
        path: 'detail',
        loadChildren: () =>
          import('@medopad/shared/pages/patient-detail').then(
            m => m.PatientDetailModule
          )
      }
    ]
  },
  {
    path: 'clinicians',
    component: DefaultLayoutComponent,
    data: {
      hideSidebar: true
    },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@medopad/shared/pages/clinicians-list').then(
            m => m.CliniciansListModule
          )
      }
    ]
  },
  {
    path: 'clinician',
    component: DefaultLayoutComponent,
    children: [
      {
        path: 'detail',
        loadChildren: () =>
          import('@medopad/shared/pages/patient-detail').then(
            m => m.PatientDetailModule
          )
      },
      {
        path: '',
        loadChildren: () =>
          import('@medopad/shared/pages/patients-list').then(
            m => m.PatientsListModule
          )
      },
      {
        path: 'my',
        loadChildren: () =>
          import('@medopad/shared/pages/patients-list').then(
            m => m.PatientsListModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(sharedRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
