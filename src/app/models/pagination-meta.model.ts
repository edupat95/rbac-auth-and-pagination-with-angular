/*"meta": {
  "itemCount": 2,
  "pageCount": null,
  "hasPreviousPage": false,
  "hasNextPage": false
}*/

export interface PaginationMeta {
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export class PaginationMetaAdapter {
  static adapt(json: any): PaginationMeta {
    return {
      itemCount: json.itemCount,
      pageCount: json.pageCount,
      hasPreviousPage: json.hasPreviousPage,
      hasNextPage: json.hasNextPage,
    };
  }
}
