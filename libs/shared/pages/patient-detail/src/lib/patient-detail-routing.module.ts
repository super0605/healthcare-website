import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultPatientLayoutComponent } from './layout';

const routes: Routes = [
  {
    path: 'questionnaire/:id',
    component: DefaultPatientLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./questionnaire/questionnaire.module').then(
            m => m.QuestionnaireModule
          )
      }
    ]
  },
  {
    path: 'profile/:id',
    component: DefaultPatientLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./profile/profile.module').then(m => m.ProfileModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientDetailRoutingModule {}
