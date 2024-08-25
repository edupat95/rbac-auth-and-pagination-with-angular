import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../auth/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { LoginResponse } from '../../models/login.model';
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';
import { Router } from '@angular/router';
import { PermissionService } from '../../auth/permission.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
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
    MatCardModule,
    ReactiveFormsModule,
    CommonModule,
    ErrorMessageComponent,
    AsyncPipe
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private fb: FormBuilder, private authService: AuthService, private permissionService: PermissionService) {}

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  router = inject(Router);

  ngOnInit(){
    if(localStorage.getItem('token')){
      this.router.navigateByUrl('/welcome');
    }
  }

  @Output() isLogged = new EventEmitter<boolean>(); //emisor de eventos

  loginResponse: LoginResponse =
  { 
    access_token: '',
  };

  errorMessage: string = '';
  login_error_message: string = '';
  subscrption?: Subscription;

  sendResultLoggin = (result: boolean) => {
    this.isLogged.emit(result);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscrption?.unsubscribe();
  }

  login = () => {
    if (this.loginForm.valid) {
      this.subscrption = this.authService.login(this.loginForm.value).subscribe(
      {
        next: async (data) => {
          this.errorMessage = '';
          this.loginResponse = data;
          localStorage.setItem('token', this.loginResponse.access_token);
          //read payload from token
          // Split the token into parts
          const parts = this.loginResponse.access_token.split('.');
          const encodedPayload = parts[1];
          //Decode the base64 encoded payload
          const decodedPayload = atob(encodedPayload);
          //convert payload to object
          const payload = JSON.parse(decodedPayload); 
          if (payload.roles && Array.isArray(payload.roles)) {
            localStorage.setItem('roles', JSON.stringify(payload.roles));
          } else {
            console.error("'roles' not found in payload");
          }

          //Load permissions in BehaviorSubject
          await this.permissionService.loadPermissions();

          this.isLogged.emit(true);
        },
        error: (error) => {
          //console.error('Error:', error.status);
          if(error.status == 401){
            this.login_error_message = 'Invalid email or password';
          } else if(error.status == 400) {
            this.login_error_message = 'Email and password is required';
          } else {
            this.login_error_message = 'An error occurred';
          }
        },
        complete: () => {}    
      });
      
    }
  }
}
