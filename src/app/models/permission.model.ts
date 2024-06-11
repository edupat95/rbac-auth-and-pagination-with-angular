import { Role } from './role.model';

export interface Permission {
  id: number;
  name: string;
  roles: Role[];
}

export class PermissionAdapter {
  static adapt(json: any): Permission {
    return {
      id: json.id,
      name: json.name,
      roles: json.roles,
    };
  }

  static adaptArray(json: any[]): Permission[] {
    return json.map((item: any) => this.adapt(item));
  }
}
