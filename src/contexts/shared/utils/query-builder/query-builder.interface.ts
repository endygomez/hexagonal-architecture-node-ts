import { PaginationParams } from "../../domain/PaginationParams";

export interface SortOrder {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterOperator {
  eq?: any;       // equals
  neq?: any;      // not equals
  gt?: number;    // greater than
  gte?: number;   // greater than or equals
  lt?: number;    // less than
  lte?: number;   // less than or equals
  like?: string;  // contains
  in?: any[];     // in array
}

export interface QueryFilters {
  [field: string]: FilterOperator | any;
}

export interface QueryParams extends PaginationParams {
  sort?: SortOrder[];
  filters?: QueryFilters;
  search?: string;
}