import { QueryParams } from "../../utils/query-builder/query-builder.interface";

export class InMemoryFilterService {
  static applyFilters<T>(items: T[], params: QueryParams): T[] {
    let filtered = [...items];

    // Aplicar búsqueda si existe
    if (params.search && params.search.trim() !== '') {
      filtered = this.applySearch(filtered, params.search);
    }

    // Aplicar filtros específicos
    if (params.filters && Object.keys(params.filters).length > 0) {
      filtered = this.applySpecificFilters(filtered, params.filters);
    }

    // Aplicar ordenamiento
    if (params.sort && params.sort.length > 0) {
      filtered = this.applySort(filtered, params.sort);
    }

    return filtered;
  }

  static applyPagination<T>(
    items: T[],
    page: number = 1,
    limit: number = 10
  ): { items: T[], totalItems: number } {
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      items: items.slice(start, end),
      totalItems: items.length
    };
  }

  private static applySearch<T>(items: T[], search: string): T[] {
    const searchLower = search.toLowerCase();
    
    return items.filter(item => {
      // Buscar en todas las propiedades string
      return Object.values(item as Record<string, unknown>).some(value => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchLower);
        }
        // Para valores anidados (como value objects)
        if (value && typeof value === 'object' && 'value' in value && typeof value.value === 'string') {
          return value.value.toLowerCase().includes(searchLower);
        }
        return false;
      });
    });
  }

  private static applySpecificFilters<T>(items: T[], filters: Record<string, any>): T[] {
    return items.filter(item => 
      Object.entries(filters).every(([field, value]) => {
        // Manejar propiedades anidadas (ej: "user.address.city")
        const fieldPath = field.split('.');
        let itemValue = item as any;
        
        for (const path of fieldPath) {
          if (itemValue === null || itemValue === undefined) return false;
          itemValue = itemValue[path];
        }

        // Manejar value objects
        if (itemValue && typeof itemValue === 'object' && 'value' in itemValue) {
          itemValue = itemValue.value;
        }

        // Comparar valores
        if (typeof value === 'object' && value !== null) {
          // Operadores avanzados (eq, lt, gt, etc)
          return this.compareWithOperators(itemValue, value);
        }
        
        return itemValue === value;
      })
    );
  }

  private static applySort<T>(items: T[], sortOrders: Array<{field: string, direction: 'asc' | 'desc'}>): T[] {
    return [...items].sort((a, b) => {
      for (const { field, direction } of sortOrders) {
        let aValue = this.getNestedValue(a, field);
        let bValue = this.getNestedValue(b, field);
        
        if (aValue !== bValue) {
          return direction === 'asc' 
            ? this.compare(aValue, bValue) 
            : this.compare(bValue, aValue);
        }
      }
      return 0;
    });
  }

  private static getNestedValue(obj: any, path: string): any {
    const keys = path.split('.');
    let value = obj;
    
    for (const key of keys) {
      if (value === null || value === undefined) return undefined;
      value = value[key];
      
      // Manejar value objects
      if (value && typeof value === 'object' && 'value' in value) {
        value = value.value;
      }
    }
    
    return value;
  }

  private static compare(a: any, b: any): number {
    if (a === undefined) return -1;
    if (b === undefined) return 1;
    
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  private static compareWithOperators(value: any, operators: Record<string, any>): boolean {
    if (!operators) return true;

    return Object.entries(operators).every(([operator, operand]) => {
      switch (operator) {
        case 'eq': return value === operand;
        case 'neq': return value !== operand;
        case 'gt': return value > operand;
        case 'gte': return value >= operand;
        case 'lt': return value < operand;
        case 'lte': return value <= operand;
        case 'like': 
          return typeof value === 'string' && 
                 typeof operand === 'string' && 
                 value.toLowerCase().includes(operand.toLowerCase());
        case 'in': return Array.isArray(operand) && operand.includes(value);
        default: return true;
      }
    });
  }
}