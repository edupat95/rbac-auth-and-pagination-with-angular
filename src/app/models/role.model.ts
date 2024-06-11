export interface Role {
  id: number;
  name: string;
}

export class RoleAdapter {
  static adapt(json: any): Role {
    return {
      id: json.id,
      name: json.name,
    };
  }

  static adaptArray(json: any[]): Role[] {
    return json.map((item: any) => this.adapt(item));
  }
}

export function rolesToString(roles: Role[]): string {
  return roles.map(rol => rol.name).join(', ');
}