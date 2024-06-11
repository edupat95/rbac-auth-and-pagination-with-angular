/* JSON RESPONSE
{
    "user": {
        "id": 18,
        "username": "eduardo",
        "roles": [
            "USER"
        ]
    }
}
*/

//create interface and adapter

export interface Profile {
  id: number;
  username: string;
  roles: string[];
}

export class ProfileAdapter {
  static adapt(json: any): Profile {
    return {
      id: json.id,
      username: json.username,
      roles: json.roles,
    };
  }
}
