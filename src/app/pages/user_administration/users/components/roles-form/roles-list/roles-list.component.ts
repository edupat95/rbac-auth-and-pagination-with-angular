import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Role } from '../../../../../../models/role.model';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [
    MatIconButton,
    MatIcon
  ],
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss']
})
export class RolesListComponent {
  @Input() index: number = -1;
  @Input() role!: Role;

  @Output() loaded = new EventEmitter<number>();

  @Output() roleSelected = new EventEmitter<Role>();

  ngOnInit(): void {
    this.loaded.emit(this.index);
  }

  selectRole(role: Role): void {
    this.roleSelected.emit(role);
  }
}
