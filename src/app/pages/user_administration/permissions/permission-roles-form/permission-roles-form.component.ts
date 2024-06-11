import { ChangeDetectorRef, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Permission } from '../../../../models/permission.model';
import { Role, RoleAdapter } from '../../../../models/role.model';
import { PermissionsService } from '../permissions.service';
import { EMPTY, Subscription, catchError, map } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { ErrorMessageComponent } from '../../../../components/error-message/error-message.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { PaginationMeta, PaginationMetaAdapter } from '../../../../models/pagination-meta.model';
import { PageRequestAdapter, PageRquest } from '../../../../models/page-request.model';
import { RoleFilters } from '../../roles/roles.service';
import { RolesListComponent } from '../../users/components/roles-form/roles-list/roles-list.component';

@Component({
  selector: 'app-permission-roles-form',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButton,
    ErrorMessageComponent,
    MatProgressSpinner,
    InfiniteScrollModule,
    CommonModule,
    RolesListComponent,
    MatIcon,
    MatIconButton
  ],
  templateUrl: './permission-roles-form.component.html',
  styleUrl: './permission-roles-form.component.scss'
})
export class PermissionRolesFormComponent {
  @Input() permission?: Permission;
  @Output() closeModal = new EventEmitter<Role[]>();

  constructor(private permissionsService: PermissionsService) { }

  characters: Array<String> = []
  nextUrl: string = '';
  isLoaded: boolean = false;
  errorMessage: string = "";
  existingRoles: Array<Role> = [];
  isLoading: boolean = false;
  subscription?: Subscription;
  rolesToSend: Role[] = [];
  //paginator 
  meta?: PaginationMeta;
  index: number = 1;
  take: number = 5;
  //paginator

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    console.log('Permission roles: ' + this.permission?.roles);
    this.findExistingRoles();
  }

  getRoleFiter = (): RoleFilters => {
    const roleFilters: RoleFilters = {
      page: this.index,
      take: this.take,
      nameFilter: '',
    };
    return roleFilters;
  };

  findExistingRoles = () => {
    console.log('findExistingRoles')
    this.isLoading = true;
    this.subscription = this.permissionsService
      .getRoles(this.getRoleFiter())
      .pipe(
        catchError((error: string) => {
          this.errorMessage = error;
          console.log(this.errorMessage);
          return EMPTY;
        }),
        map((pageRequest: PageRquest) => ({
          resultPageRequest: PageRequestAdapter.adapt(pageRequest), //Adapt PageRequest object
          listOfRoles: RoleAdapter.adaptArray(pageRequest.data), //Adapt List of roles
          meta: PaginationMetaAdapter.adapt(pageRequest.meta), //Adapt Meta data of pagination
        }))
      )
      .subscribe((data) => {
        this.existingRoles = [...this.existingRoles, ...data.listOfRoles];
        console.log('Existing Roles', this.existingRoles);
        this.meta = data.meta;
        this.isLoading = false;
      });
  };

  cdr = inject(ChangeDetectorRef);
  items = this.permissionsService.generateItems(0, 50);

  loadItems(i: number) {
    console.log("Load items");
    if (i === this.existingRoles.length - 1) {
      this.index = this.index + 1;
      this.findExistingRoles();
      
      this.cdr.detectChanges();
      }
  }

  addRole(role: Role){
    if(this.permission){ //CASE Update permission roles
      const existingRoleIndex = this.permission?.roles.findIndex(existingRole => existingRole.id === role.id);
      if (existingRoleIndex === -1) {
        //console.log('Role not found, adding...');
        this.permission?.roles.push(role); // Assuming you have logic to update user roles
      }
    } else { //Case Create new permission
      const existingRoleIndex = this.rolesToSend.findIndex(existingRole => existingRole.id === role.id);
      if (existingRoleIndex === -1) {
        this.rolesToSend.push(role); // Assuming you have logic to update user roles
      }
    }
    
  }

  removeRole(role: Role){
    if(this.permission){ //CASE Update permission roles
      const existingRoleIndex = this.permission?.roles.findIndex(existingRole => existingRole.id === role.id);
      if (existingRoleIndex !== -1) {
        //console.log('Role found, removing...');
        if(existingRoleIndex){
          this.permission?.roles.splice(existingRoleIndex, 1); // Assuming you have logic to update user roles
        }
      }
    } else { //Case Create new permission
      const existingRoleIndex = this.rolesToSend.findIndex(existingRole => existingRole.id === role.id);
      if (existingRoleIndex !== -1) {
        if(existingRoleIndex){
          this.rolesToSend.splice(existingRoleIndex, 1); // Assuming you have logic to update user roles
        }
      } 
    }
  }

  closeModalHandler() {
    if(this.permission){
      this.closeModal.emit(this.permission.roles);
    } else {
      this.closeModal.emit(this.rolesToSend);
    }
  }
}
