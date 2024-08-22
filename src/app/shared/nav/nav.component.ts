import { Component, EventEmitter, Injectable, Output, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { AppService } from '../../app.service';
import { PermissionService } from '../../auth/permission.service';
@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    RouterOutlet, 
    MatButtonModule,
    MatSidenavModule,
    MatSelectModule,
    MatFormFieldModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatExpansionModule,
    MatTooltipModule,
    FormsModule,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {

  constructor(private authService: AuthService, private permissionService: PermissionService) {}

  ngOnInit(): void {
    this.loadPermissions();
    if (!localStorage.getItem('token')) {
      this.router.navigateByUrl('/login');
    }
  }

  @Output() isLogged = new EventEmitter<boolean>(); //emisor de eventos

  router = inject(Router);


  //permissions
  canListPermissions = false;
  canSeeModuleUserAdministration = false;
  canSeeModuleProductsAdministration = false; 
  canSeeModuleSalesBox = false;

  async loadPermissions() {
    this.canListPermissions = await this.permissionService.has_permission('CAN-LIST-PERMISSIONS');
    this.canSeeModuleUserAdministration = await this.permissionService.has_permission('CAN-SEE-MODULE-USERS-ADMINISTRATION');
    this.canSeeModuleProductsAdministration = await this.permissionService.has_permission('CAN-SEE-MODULE-PRODUCTS-ADMINISTRATION');
    this.canSeeModuleSalesBox = await this.permissionService.has_permission('CAN-SEE-MODULE-SALES-BOX');
    
    //console.log('canListPermissions: ', this.canListPermissions);
    //console.log('canSeeModuleUserAdministration: ', this.canSeeModuleUserAdministration);
    //console.log('canSeeModuleProductsAdministration: ', this.canSeeModuleProductsAdministration);
    //console.log('canSeeModuleSalesBox: ', this.canSeeModuleSalesBox);
  }

  //permissions

  

  title = 'Eduardo Patinella - Software Engineer';
  languages = [
    { name: 'English', code: 'english' },
    { name: 'Español', code: 'spanish' }
  ];
  
  language_selected = this.languages[0].code; // Default to Spanish

  changeLanguage(language: string) {
    this.language_selected = language;
  }

  getLanguageName(code: string): string {
    return this.languages.find(lang => lang.code === code)?.name || '';
  }

  logout = () => {
    this.authService.logout();
    this.isLogged.emit(false);
    this.router.navigateByUrl('/login');
  }

  
} 
