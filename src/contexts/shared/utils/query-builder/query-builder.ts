import { FilterOperator, SortOrder } from "./query-builder.interface";

export class QueryBuilder {
  private query: string;
  private params: any[];
  private paramCount: number;

  constructor(baseQuery: string) {
    this.query = baseQuery;
    this.params = [];
    this.paramCount = 0;
  }

  addFilter(field: string, operator: FilterOperator): this {
    if (!operator) return this;

    if (operator.eq !== undefined) {
      this.addWhere(`${field} = $${++this.paramCount}`);
      this.params.push(operator.eq);
    }
    if (operator.like !== undefined) {
      this.addWhere(`${field} ILIKE $${++this.paramCount}`);
      this.params.push(`%${operator.like}%`);
    }
    // Add more operators as needed...

    return this;
  }

  addSort(sorts: SortOrder[]): this {
    if (!sorts?.length) return this;

    const orderBy = sorts
      .map(sort => `${sort.field} ${sort.direction}`)
      .join(', ');
    
    this.query += ` ORDER BY ${orderBy}`;
    return this;
  }

  addPagination(page: number, limit: number): this {
    this.query += ` LIMIT $${++this.paramCount} OFFSET $${++this.paramCount}`;
    this.params.push(limit, (page - 1) * limit);
    return this;
  }

  private addWhere(condition: string): void {
    this.query += this.query.includes('WHERE') ? ` AND ${condition}` : ` WHERE ${condition}`;
  }

  build(): { text: string; values: any[] } {
    return { text: this.query, values: this.params };
  }
}