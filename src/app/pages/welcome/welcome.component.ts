import { Component } from '@angular/core';
import { Profile, ProfileAdapter } from '../../models/profile.model';
import { WelcomeService } from './welcome.service';
import { EMPTY, Observable, Subscription, catchError, find, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    AsyncPipe,
    ErrorMessageComponent
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
})
export class WelcomeComponent {
  public profile$?: Observable<any>;

  constructor(private welcomeService: WelcomeService) {}

  errorMessage: string = '';

  profile?: Profile;

  subscription?: Subscription;
  
  ngOnInit(): void {
    //mostrar el contenido de profile$ una vez finalice la petición
    this.findProfile();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription?.unsubscribe();
  }

  findProfile() {
    this.subscription = this.welcomeService.getProfile().pipe(
      catchError((error: string) => {
        this.errorMessage = error;
        console.log(this.errorMessage);
        return EMPTY;
      })
    ).subscribe((profile: any) => {
      this.profile = ProfileAdapter.adapt(profile);
      localStorage.setItem('roles', JSON.stringify(this.profile.roles));
      
    });
  }

  
}
