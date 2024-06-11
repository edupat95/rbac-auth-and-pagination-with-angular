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
  
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      //redirect to login
      
    }
  }
  @Output() isLogged = new EventEmitter<boolean>(); //emisor de eventos

  router = inject(Router);

  canSeeModuleUserAdministration = this.authService.canSeeModuleUserAdministration();
  canSeeModuleProductsAdministration = this.authService.canSeeModuleProductsAdministration(); 
  canSeeModuleSalesBox = this.authService.canSeeModuleSalesBox();

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
