import { Component } from '@angular/core';
import { User } from '../../../models/user.model';
import { UsersService } from './users.service';
import {
  PageRequestAdapter,
  PageRquest,
} from '../../../models/page-request.model';
import { UserAdapter } from '../../../models/user.model';
import { Observable, Subscription, catchError, of } from 'rxjs';
import { ErrorMessageComponent } from '../../../components/error-message/error-message.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {
  PaginationMeta,
  PaginationMetaAdapter,
} from '../../../models/pagination-meta.model';
import { MatButton } from '@angular/material/button';
import { UserFormComponent } from './components/user-form/user-form.component';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatOption, MatSelect } from '@angular/material/select';
import { UserFilters } from './users.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    ErrorMessageComponent,
    MatTableModule,
    MatPaginator,
    MatButton,
    UserFormComponent,
    MatInputModule,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  
  constructor(private usersService: UsersService, private fb: FormBuilder) {}
  isLoading: boolean = true;
  resultPageRequest$?: Observable<any>;
  private suscription?: Subscription;
  listOfUsers: User[] = [];
  usersToTable: UserToTable[] = [];
  resultPageRequest?: PageRquest;
  errorMessage: string = '';
  selectedUser?: User;
  openUserModal: boolean = false;

  //filters
  private filters: UserFilters = {
    emailFilter: '',
    usernameFilter: '',
    stateFilter: 2,
  };
  filterForm = this.fb.group({
    emailFilter: [this.filters.emailFilter, []],
    usernameFilter: [this.filters.usernameFilter, []],
    stateFilter: [this.filters.stateFilter, []],
  });
  //filters

  // Mat table
  displayedColumns: string[] = [
    'username',
    'email',
    'isActive',
    'roles',
    'actions',
  ];
  dataSource = new MatTableDataSource<UserToTable>([]);
  // Mat table

  //paginator
  meta?: PaginationMeta;
  pageIndex: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  //paginator

  async ngOnInit() {
    await this.findUsers();
  }

  ngOnDestroy() {
    //console.log('DESTROY')
    if (this.suscription) {
      this.suscription.unsubscribe();
    }
  }

  handleFilterUsers = () => {
    //change filters values
    this.pageIndex = 0;
    this.filterForm.value.emailFilter
      ? (this.filters.emailFilter = this.filterForm.value.emailFilter)
      : (this.filters.emailFilter = '');
    this.filterForm.value.usernameFilter
      ? (this.filters.usernameFilter = this.filterForm.value.usernameFilter)
      : (this.filters.usernameFilter = '');
    this.filterForm.value.stateFilter
      ? (this.filters.stateFilter = this.filterForm.value.stateFilter)
      : (this.filters.stateFilter = 2);

    this.findUsers();
  };

  handlePageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    this.findUsers();
  }

  //Create function that return UserFilter object
  getUserFiter = (): UserFilters => {
    const userFilters: UserFilters = {
      page: this.pageIndex + 1,
      take: this.pageSize,
      emailFilter: this.filters.emailFilter,
      usernameFilter: this.filters.usernameFilter,
      stateFilter: this.filters.stateFilter,
    };
    return userFilters;
  };

  findUsers = () => {
    this.isLoading = true;

    this.suscription = this.usersService
      .getUsers(this.getUserFiter())
      .pipe(
        catchError((error: string) => {
          this.errorMessage = error;
          console.error(this.errorMessage);
          return of(error);
        }),
        // Process data within pipe
        map((pageRequest: any) => ({
          resultPageRequest: PageRequestAdapter.adapt(pageRequest),
          listOfUsers: UserAdapter.adaptArray(pageRequest.data),
          meta: PaginationMetaAdapter.adapt(pageRequest.meta),
          usersToTable: pageRequest.data.map((user: User) => ({
            id: user.id,
            username: user.username,
            email: user.email,
            isActive: user.isActive,
            roles: user.roles,
          })),
        }))
      ).subscribe((data) => {
      this.listOfUsers = data.listOfUsers;
      this.meta = data.meta;
      this.usersToTable = data.usersToTable;
      this.isLoading = false;
      this.dataSource = new MatTableDataSource<UserToTable>(this.usersToTable);
      if (this.dataSource) {
        this.openUserModal = false;
        this.selectedUser = undefined;
      }
    });

  };

  selectUser = async (user: User) => {
    this.selectedUser = user;
    //transform user roles to array of role names
    this.openUserModal = true;
  };

  createUser = async () => {
    this.selectedUser = undefined;
    this.openUserModal = true;
  };
}

interface UserToTable {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  roles: string;
}
