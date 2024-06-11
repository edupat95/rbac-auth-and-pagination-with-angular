import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { authGuard } from '../../guards/auth.guard';
import { roleGuard } from '../../guards/role.guard';

const routes: Routes = [
  {
    path: '', // Empty path for the module's root
    children: [
      {
        path: 'users',
        component: UsersComponent,
        title: 'Users',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'GENERAL-MANAGER'] },
      },
      {
        path: 'roles',
        component: RolesComponent,
        title: 'Roles',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'GENERAL-MANAGER'] },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserAdministrationRoutingModule {}
