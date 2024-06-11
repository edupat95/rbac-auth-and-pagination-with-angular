export interface PageRquest {
  data: any[];
  meta: any;
}

export class PageRequestAdapter {
  static adapt(json: any): PageRquest {
    return {
      data: json.data,
      meta: json.meta,
    };
  }
}
