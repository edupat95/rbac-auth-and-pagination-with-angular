import { Component, EventEmitter, Input, Output, input } from '@angular/core';
import { User } from '../../../../../models/user.model';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { EMPTY, Subscription, catchError, min } from 'rxjs';
import { UsersService } from '../../users.service';
import { ErrorMessageComponent } from '../../../../../components/error-message/error-message.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { RolesFormComponent } from '../roles-form/roles-form.component';
import { Role } from '../../../../../models/role.model';
@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButton,
    ErrorMessageComponent,
    MatProgressSpinner,
    RolesFormComponent
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent {
  @Input() user?: User;
  // destructurar user

  //event emiter for close modal
  @Output() close = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private usersService: UsersService) {}

  isLoaded: boolean = false;
  disabledForm: boolean = false;
  errorMessage: string = '';
  private subscription?: Subscription;
  openRolesModal: boolean = false;

  ngOnInit(): void {
    //If user is defined, then we are editing an existing user
    if (localStorage.getItem('roles')?.includes('ADMIN')) {
      this.disabledForm = false;
    }
    this.setUserForm();
  }

  userForm = this.fb.group({
    username: [
      { value: this.user?.username, disabled: this.disabledForm },
      [Validators.required, Validators.minLength(8)],
    ],
    email: [
      { value: this.user?.email, disabled: this.disabledForm },
      [Validators.required, Validators.email],
    ],
    password: [
      { value: '', disabled: this.disabledForm },
      this.getPasswordValidators(),
    ],
    roles: [{ 
      value: this.user?.roles?.map(role => role.name), 
      disabled: true 
    }],
  });

  getPasswordValidators() {
    return this.user
      ? [Validators.minLength(8)]
      : [Validators.required, Validators.minLength(8)];
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription?.unsubscribe();
  }

  closeModal = () => {
    this.user = undefined;
    this.close.emit();
  };

  addUserHandler = () => {
    //validate form
    if (this.userForm.valid) {
      this.isLoaded = true;

      //const { username, email, password, roles } = this.userForm.value;
      const username = this.userForm.get('username')?.value ?? '';
      const email = this.userForm.get('email')?.value ?? '';
      const password = this.userForm.get('password')?.value ?? '';

      this.subscription = this.usersService.createUser(username, email, password)
        .pipe(
          catchError((error: string) => {
            this.errorMessage = error;
            console.error(this.errorMessage);
            alert(this.errorMessage);
            return EMPTY;
          })
        )
        .subscribe(() => {
          this.isLoaded = false;
          alert('User created successfully!');
          this.closeModal();
        });
    } else {
      alert('Data is not valid');
    }
  };

  editUser = () => {
    if(this.userForm.valid && this.user) {
      this.isLoaded = true;

      const username = this.userForm.get('username')?.value ?? '';
      const email = this.userForm.get('email')?.value ?? '';
      const password = this.userForm.get('password')?.value ?? '';
      const roles = this.user?.roles;

      const userToEdit: User = {
        id: this.user.id,
        username: username,
        email: email,
        isActive: true,
        roles: roles,
      };

      this.subscription = this.usersService
        .updateUser(userToEdit, password)
        .pipe(
          catchError((error: string) => {
            alert(error);
            console.error(this.errorMessage);
            return EMPTY;
          })
        )
        .subscribe((data) => {
          alert('Success update!');
          this.isLoaded = false;
          this.closeModal();
        });
    }

  };

  disableUser = async () => {
    if (!this.user) return alert('User not found');
    this.subscription = await this.usersService
      .deleteUser(this.user.id)
      .pipe(
        catchError((error: string) => {
          this.errorMessage = error;
          console.error(this.errorMessage);
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.closeModal();
      });
  };

  disableUserHandler = () => {
    if (!this.user) return alert('User not found');
    this.disableUser();
  };

  enableUser = async () => {
    if (!this.user) return alert('User not found');
    this.subscription = await this.usersService
      .enableUser(this.user.id)
      .pipe(
        catchError((error: string) => {
          this.errorMessage = error;
          console.error(this.errorMessage);
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.closeModal();
      });
  };

  enableUserHandler = async () => {
    if (!this.user) return alert('User not found');
    await this.enableUser();
  };

  setUserForm = () => {
    if (this.user) {
      this.userForm.patchValue({
        username: this.user.username,
        email: this.user.email,
        roles: this.user.roles.map((role) => '(' + role.name + ')'),
      });

      this.userForm
        .get('password')
        ?.setValidators(this.getPasswordValidators());
      this.userForm.get('password')?.updateValueAndValidity();
    } else {
      this.userForm.patchValue({
        username: '',
        email: '',
        roles: [],
      });
    }
  };

  openRolesModalHandle = () => {
    this.openRolesModal = true;
  };

  closeRolesModal = (roles: Role[]) => {
    this.userForm.patchValue({
      roles: roles.map((role) => "(" + role.name + ")"),
    });

    this.user ? this.user.roles = roles : null;

    this.openRolesModal = false;
  }
}
