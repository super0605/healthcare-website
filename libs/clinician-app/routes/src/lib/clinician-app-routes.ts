import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedUiModule } from '@medopad/shared/mpui';

// To modify shared routes with new routes
import { AppRoutingModule as SharedRoutingModule } from '@medopad/shared/routes';

const clinicianRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
  // {
  //   path: 'login',
  //   component: AppLayoutComponent,
  //   children: [
  //     {
  //       path: '',
  //       loadChildren: () =>
  //         import('@medopad/clinician-app/ui').then(m => m.LoginModule)
  //     }
  //   ]
  // }
];

@NgModule({
  // To override all shared routes with new routes, just remove SharedRoutingModule from import list
  imports: [
    SharedUiModule,
    SharedRoutingModule,
    RouterModule.forRoot(clinicianRoutes)
  ],
  declarations: [],
  exports: [RouterModule]
})
export class AppRoutingModule {}
