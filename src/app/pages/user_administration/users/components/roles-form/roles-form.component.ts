import { ChangeDetectorRef, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule,  } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { Role, RoleAdapter } from '../../../../../models/role.model';
import { User, UserAdapter } from '../../../../../models/user.model';
import { ErrorMessageComponent } from '../../../../../components/error-message/error-message.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RolesListComponent } from './roles-list/roles-list.component';
import { UsersService } from '../../users.service';
import { EMPTY, Subscription, catchError, map, of } from 'rxjs';
import { PageRequestAdapter, PageRquest } from '../../../../../models/page-request.model';
import { PaginationMeta, PaginationMetaAdapter } from '../../../../../models/pagination-meta.model';
import { RoleFilters } from '../../../roles/roles.service';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
@Component({
  selector: 'app-roles-form',
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
  templateUrl: './roles-form.component.html',
  styleUrl: './roles-form.component.scss'
})
export class RolesFormComponent {

  @Input() user!: User;
  @Output() closeModal = new EventEmitter<Role[]>();

  constructor(private usersService: UsersService) { }

  characters: Array<String> = []
  nextUrl: string = '';
  isLoaded: boolean = false;
  errorMessage: string = "";
  existingRoles: Array<Role> = [];
  isLoading: boolean = false;
  subscription?: Subscription;
  
  //paginator 
  meta?: PaginationMeta;
  index: number = 1;
  take: number = 5;
  //paginator

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {

    console.log('User roles: ' + this.user.roles);
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
    this.subscription = this.usersService
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
  items = this.usersService.generateItems(0, 50);

  loadItems(i: number) {
    console.log("Load items");
    if (i === this.existingRoles.length - 1) {
    //if (i === this.items.length - 1) {
      //const newItems = this.usersService.generateItems(i, 10);
      //this.items = [...this.items, ...newItems];
      this.index = this.index + 1;
      this.findExistingRoles();
      
      this.cdr.detectChanges();
      }
  }

  addRole(role: Role){
    const existingRoleIndex = this.user.roles.findIndex(existingRole => existingRole.id === role.id);
    if (existingRoleIndex === -1) {
      //console.log('Role not found, adding...');
      this.user.roles.push(role); // Assuming you have logic to update user roles
    }
  }

  removeRole(role: Role){
    const existingRoleIndex = this.user.roles.findIndex(existingRole => existingRole.id === role.id);
    if (existingRoleIndex !== -1) {
      //console.log('Role found, removing...');
      this.user.roles.splice(existingRoleIndex, 1); // Assuming you have logic to update user roles
    }
  }

  closeModalHandler() {
    this.closeModal.emit(this.user.roles);
  }

  
}
