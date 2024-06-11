import { Component, Input, EventEmitter, OnInit, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavComponent } from './shared/nav/nav.component';
import { LoginComponent } from './pages/login/login.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    RouterLink,
    NavComponent,
    LoginComponent,

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  

  constructor(private router:Router){
    this.verifySession();
  }

  isLogged = false;
  
  verifySession = () => {
    if (localStorage.getItem('token')) {
      this.isLogged = true;
      this.router.navigateByUrl('/welcome');
    } else {
      this.isLogged = false;
    }    
  }

  reslutLogin = ($event: boolean) => {
    this.isLogged = $event;
  }
}
