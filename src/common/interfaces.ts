export interface Response {
  file?: Buffer;
  data?: Record<string, any> | Record<string, any>[];
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    count: number;
  };
}

export interface Pagination {
  limit: number;
  offset: number;
}
