import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { ErrorMessageComponent } from '../../../../components/error-message/error-message.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Permission } from '../../../../models/permission.model';
import { EMPTY, Subscription, catchError, map } from 'rxjs';
import { PermissionsService } from '../permissions.service';
import { PermissionRolesFormComponent } from '../permission-roles-form/permission-roles-form.component';
import { Role } from '../../../../models/role.model';

@Component({
  selector: 'app-permission-form',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatButton,
    ReactiveFormsModule,
    FormsModule,
    ErrorMessageComponent,
    MatProgressSpinner,
    PermissionRolesFormComponent,
  ],
  templateUrl: './permission-form.component.html',
  styleUrl: './permission-form.component.scss',
})
export class PermissionFormComponent {
  constructor(
    private fb: FormBuilder,
    private permissionsService: PermissionsService
  ) {
    console.log('PermissionFormComponent');
  }

  @Input() permission?: Permission;
  //event emiter for close modal
  @Output() close = new EventEmitter<void>();

  disabledForm: boolean = false;
  errorMessage: string = '';
  isLoaded: boolean = false;
  private subscription?: Subscription;
  openRolesModal: boolean = false;
  permissionForm!: FormGroup;
  rolesToSend: Role[] = [];

  rolesToString(roles: Role[]): string {
    return roles.map((role) => role.name).join(', ');
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm = () => {
    this.permissionForm = this.fb.group({
      name: [
        { value: this.permission?.name, disabled: this.disabledForm },
        [Validators.required, Validators.minLength(10)],
      ],
      roles: [
        {
          value: this.permission?.roles
            ? this.rolesToString(this.permission.roles)
            : '',
          disabled: true,
        },
      ],
    });
  };

  closeModalHandle = () => {
    console.log('closeModalHandle in PermissionFormComponent');
    this.close.emit();
  };

  openRolesModalHandle = () => {
    this.openRolesModal = true;
  };

  addPermissionHandler = () => {
    //validate form
    if (this.permissionForm.valid) {
      this.isLoaded = true;
      
      this.subscription = this.permissionsService.createPermission(this.permissionForm.value.name, this.rolesToSend)
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
          alert('Permission created successfully!');
          this.closeModal();
        });
    } else {
      alert('Data is not valid');
    }
  };

  closeModal = () => {
    this.permission = undefined;
    this.close.emit();
  };

  deletePermissionHandler = () => {
    if (this.permission) {
      this.isLoaded = true;
      this.subscription = this.permissionsService
        .deletePermission(this.permission.id)
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
          alert('Permission deleted successfully!');
          this.closeModal();
        });
    }
  }

  editPermissionHandler = () => {
    if (this.permissionForm.valid && this.permission) {
      this.isLoaded = true;
      this.subscription = this.permissionsService
        .updatePermission(this.permission.id, this.permissionForm.value.name, this.rolesToSend)
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
          alert('Permission updated successfully!');
          this.closeModal();
        });
    } else {
      alert('Data is not valid');
    }
  }

  closeRolesModal = (roles: Role[]) => {
    this.permissionForm.patchValue({
      roles: this.rolesToString(roles),
    });

    this.rolesToSend = roles;

    this.openRolesModal = false;
  };
}
