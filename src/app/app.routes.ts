import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { UsersComponent } from './pages/user_administration/users/users.component';
import { RolesComponent } from './pages/user_administration/roles/roles.component';
import { PermissionsComponent } from './pages/user_administration/permissions/permissions.component';
import { permissionGuard } from './guards/permission.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },

  {
    path: 'welcome',
    component: WelcomeComponent, 
    title: 'Welcome',
    canActivate: [authGuard],    
  },
  {
    path: 'users',
    component: UsersComponent, 
    title: 'users',
    canActivate: [authGuard, permissionGuard],
    data: {
      permission: ['USER-ADMINISTRATION-CAN-LIST-USERS'],
    }
  },
  {
    path: 'roles',
    component: RolesComponent, 
    title: 'roles',
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['ADMIN', 'GENERAL-MANAGER']
    }
  },
  {
    path: 'permissions',
    title: 'permissions',
    component: PermissionsComponent,
    canActivate: [authGuard, permissionGuard],
    data: {
      permission: "CAN-LIST-PERMISSIONS"
    }
  }
];
