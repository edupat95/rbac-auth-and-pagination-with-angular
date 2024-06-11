import { Component } from '@angular/core';
import { Role, RoleAdapter } from '../../../models/role.model';
import { RoleFilters, RolesService } from '../roles/roles.service';
import {
  PageRequestAdapter,
  PageRquest,
} from '../../../models/page-request.model';
import { EMPTY, Observable, Subscription, catchError, tap } from 'rxjs';
import { ErrorMessageComponent } from '../../../components/error-message/error-message.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {
  PaginationMeta,
  PaginationMetaAdapter,
} from '../../../models/pagination-meta.model';
import { MatButton } from '@angular/material/button';
import { RoleFormComponent } from './role-form/role-form.component';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatOption, MatSelect } from '@angular/material/select';
//import { RoleFilters } from '../roles/roles.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    ErrorMessageComponent,
    MatTableModule,
    MatPaginator,
    MatButton,
    RoleFormComponent,
    MatInputModule,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
})
export class RolesComponent {
  constructor(private rolesService: RolesService, private fb: FormBuilder) {}
  isLoading: boolean = true;
  listOfRoles: Role[] = [];
  private subscription?: Subscription;
  errorMessage: string = '';
  selectedRole?: Role;
  openRoleModal: boolean = false;

  // Mat table
  displayedColumns: string[] = ['name', 'actions'];
  dataSource = new MatTableDataSource<Role>([]);
  // Mat table

  //paginator
  meta?: PaginationMeta;
  pageIndex: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  //paginator

  ngOnInit() {
    this.findRoles();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription?.unsubscribe();
  }

  private filters: RoleFilters = {
    nameFilter: '',
  };

  filterForm = this.fb.group({
    nameFilter: [this.filters.nameFilter, []],
  });

  handleFilterRoles = () => {
    //change filters values
    this.pageIndex = 0;
    this.filterForm.value.nameFilter
      ? (this.filters.nameFilter = this.filterForm.value.nameFilter)
      : (this.filters.nameFilter = '');
    
    this.findRoles();
  };

  handlePageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    this.findRoles();
  }

  //Create function that return RoleFilter object
  getRoleFiter = (): RoleFilters => {
    const roleFilters: RoleFilters = {
      page: this.pageIndex + 1,
      take: this.pageSize,
      nameFilter: this.filters.nameFilter,
    };
    return roleFilters;
  };

  findRoles = () => {
    this.isLoading = true;
    // ... other state updates (rest of the code remains the same)

    this.subscription = this.rolesService
      .getRoles(this.getRoleFiter())
      .pipe(
        catchError((error: string) => {
          this.errorMessage = error;
          console.log(this.errorMessage);
          return EMPTY;
        }),
        // Procesamiento de datos dentro de pipe
        map((pageRequest: PageRquest) => ({
          resultPageRequest: PageRequestAdapter.adapt(pageRequest), //Adapt PageRequest object
          listOfRoles: RoleAdapter.adaptArray(pageRequest.data), //Adapt List of roles
          meta: PaginationMetaAdapter.adapt(pageRequest.meta), //Adapt Meta data of pagination
        }))
        // Actualización de estado dentro de pipe (opcional)
        //tap(({ listOfRoles }) => console.log(listOfRoles)) // Ejemplo de tap
      )
      .subscribe((data) => {
        this.listOfRoles = data.listOfRoles;
        this.meta = data.meta;
        this.isLoading = false;
        this.dataSource = new MatTableDataSource<Role>(this.listOfRoles);
        if (this.dataSource) {
          this.openRoleModal = false;
          this.selectedRole = undefined;
        }
      });
  };

  selectRole = async (role: Role) => {
    this.selectedRole = role;
    this.openRoleModal = true;
  };

  createRole = async () => {
    this.selectedRole = undefined;
    this.openRoleModal = true;
  };
}
