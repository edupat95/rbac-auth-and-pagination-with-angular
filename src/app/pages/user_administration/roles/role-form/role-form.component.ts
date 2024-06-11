import { Component, EventEmitter, Input, Output, input } from '@angular/core';
import { Role } from '../../../../models/role.model';
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
import { RolesService } from '../roles.service';
import { ErrorMessageComponent } from '../../../../components/error-message/error-message.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatButton,
    ReactiveFormsModule,
    FormsModule,
    ErrorMessageComponent,
    MatProgressSpinner,
  ],
  templateUrl: './role-form.component.html',
  styleUrl: './role-form.component.scss',
})
export class RoleFormComponent {
  @Input() selectedRole?: Role;
  // destructurar role

  //event emiter for close modal
  @Output() close = new EventEmitter<void>();

  disabledForm: boolean = false;
  errorMessage: string = '';
  isLoaded: boolean = false;
  private subscription?: Subscription;

  constructor(private fb: FormBuilder, private rolesService: RolesService) {}

  ngOnChanges(): void {
    this.setRoleForm();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    //If role is defined, then we are editing an existing role
    if (localStorage.getItem('roles')?.includes('ADMIN')) {
      this.disabledForm = false;
    }

    this.setRoleForm();
  }

  roleForm = this.fb.group({
    name: [
      { value: this.selectedRole?.name, disabled: this.disabledForm },
      [Validators.required, Validators.minLength(5)],
    ],
  });

  setRoleForm = () => {
    if (this.selectedRole) {
      this.roleForm.patchValue({
        name: this.selectedRole.name,
      });
    } else {
      this.roleForm.patchValue({
        name: '',
      });
    }
  };

  closeModal = () => {
    this.selectedRole = undefined;
    this.close.emit();
  };

  addRole = () => {
    if(this.roleForm.valid && this.roleForm.value.name) {
      this.subscription = this.rolesService.createRole(this.roleForm.value.name).pipe(
        catchError((error) => {
          this.errorMessage = error;
          console.error('error');
          alert(error);
          return EMPTY;
        })
      ).subscribe((response) => {
        if (response) {
          this.closeModal();
          //alert('Role created successfully.');
        }
      });

    } else {
      alert('The role name is required and must have at least 5 characters.');
    }
  }

  addRoleHandler = () => {
    this.addRole();
  };

  editRole = async () => {
    console.log('editRole');
    await this.closeModal();
  };

  deleteRole = () => {
    if(!this.selectedRole) {
      this.errorMessage = 'Role not found.';
      return;
    }
    
    this.isLoaded = true;

    this.subscription = this.rolesService.deleteRole(this.selectedRole.name).pipe(
        catchError((error) => {
          this.errorMessage = error;
          alert('Error deleting role.' + error);
          this.isLoaded = false;
          this.closeModal();
          return EMPTY;
        }))
        .subscribe(() => {
        //alert('Role deleted successfully.');
        this.isLoaded = false;
        this.closeModal();
      }) 
    
    
  }

  deleteRoleHandler = () => {
    this.deleteRole();
  };
}
