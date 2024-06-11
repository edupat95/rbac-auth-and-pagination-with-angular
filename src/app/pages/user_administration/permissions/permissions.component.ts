import { Component } from '@angular/core';
import { PermissionFilters, PermissionsService } from './permissions.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subscription, catchError, map, of } from 'rxjs';
import { Permission, PermissionAdapter } from '../../../models/permission.model';
import { Role, RoleAdapter } from '../../../models/role.model';
import { PageRequestAdapter, PageRquest } from '../../../models/page-request.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PaginationMeta, PaginationMetaAdapter } from '../../../models/pagination-meta.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ErrorMessageComponent } from '../../../components/error-message/error-message.component';
import { MatButton } from '@angular/material/button';
import { UserFormComponent } from '../users/components/user-form/user-form.component';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PermissionFormComponent } from './permission-form/permission-form.component';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [
    ErrorMessageComponent,
    MatTableModule,
    MatPaginator,
    MatButton,
    PermissionFormComponent,
    MatInputModule,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.scss'
})
export class PermissionsComponent {

  constructor(private permissionsService: PermissionsService, private fb: FormBuilder) {}
  isLoading: boolean = true;
  resultPageRequest$?: Observable<any>;
  private suscription?: Subscription;
  listOfPermissions: Permission[] = [];
  usersToTable: PermissionToTable[] = [];
  resultPageRequest?: PageRquest;
  errorMessage: string = '';
  selectedPermission?: Permission;
  openPermissionModal: boolean = false;

  //filters
  private filters: PermissionFilters = {
    nameFilter: '',
  };
  filterForm = this.fb.group({
    nameFilter: [this.filters.nameFilter, []],
  });
  //filters

  // Mat table
  displayedColumns: string[] = [
    'name',
    'roles',
    'actions',
  ];
  dataSource = new MatTableDataSource<PermissionToTable>([]);
  // Mat table

  //paginator
  meta?: PaginationMeta;
  pageIndex: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  //paginator

  async ngOnInit() {
    await this.findPermissions();
  }

  ngOnDestroy() {
    //console.log('DESTROY')
    if (this.suscription) {
      this.suscription.unsubscribe();
    }
  }

  handleFilterPermissions = () => {
    //change filters values
    this.pageIndex = 0;
    this.filterForm.value.nameFilter
      ? (this.filters.nameFilter = this.filterForm.value.nameFilter)
      : (this.filters.nameFilter = '');
    this.findPermissions();
  };

  handlePageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    this.findPermissions();
  }

  //Create function that return UserFilter object
  getUserFiter = (): PermissionFilters => {
    const userFilters: PermissionFilters = {
      page: this.pageIndex + 1,
      take: this.pageSize,
      nameFilter: this.filters.nameFilter,
    };
    return userFilters;
  };

  findPermissions = () => {
    this.isLoading = true;

    this.suscription = this.permissionsService
      .getPermissions(this.getUserFiter())
      .pipe(
        catchError((error: string) => {
          this.errorMessage = error;
          console.error(this.errorMessage);
          return of(error);
        }),
        // Process data within pipe
        map((pageRequest: any) => ({
          resultPageRequest: PageRequestAdapter.adapt(pageRequest),
          listOfPermissions: PermissionAdapter.adaptArray(pageRequest.data),
          meta: PaginationMetaAdapter.adapt(pageRequest.meta),
          usersToTable: pageRequest.data.map((permission: Permission) => ({
            id: permission.id,
            name: permission.name,
            roles: RoleAdapter.adaptArray(permission.roles),
          })),
        }))
      ).subscribe((data) => {
      this.listOfPermissions = data.listOfPermissions;
      this.meta = data.meta;
      this.usersToTable = data.usersToTable;
      this.isLoading = false;
      this.dataSource = new MatTableDataSource<PermissionToTable>(this.usersToTable);
      if (this.dataSource) {
        this.openPermissionModal = false;
        this.selectedPermission = undefined;
      }
    });

  };

  selectPermission = async (permission: Permission) => {
    this.selectedPermission = permission;
    //transform user roles to array of role names
    this.openPermissionModal = true;
  };

  createPermission = async () => {
    this.selectedPermission = undefined;
    this.openPermissionModal = true;
  };

  getRolesString(roles: Role[]): string {
    return roles.map(role => role.name).join(', ');
  }
}

interface PermissionToTable {
  id: number;
  name: string;
  roles: Role[];
}

