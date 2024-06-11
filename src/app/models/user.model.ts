import { Role } from './role.model';

export interface User {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  roles: Role[];
}

export class UserAdapter {
  static adapt(json: any): User {
    return {
      id: json.id,
      username: json.username,
      email: json.email,
      isActive: json.isActive,
      roles: json.roles,
    };
  }

  static adaptArray(json: any[]): User[] {
    return json.map((item: any) => this.adapt(item));
  }
}
