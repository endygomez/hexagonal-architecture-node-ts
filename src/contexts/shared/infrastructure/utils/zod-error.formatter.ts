import { ZodError } from "zod";

export function formatZodError(error: ZodError) {
  return error.issues.map(issue => {
    const base = {
      field: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    };
    // Solo agrega 'keys' si el issue es de tipo 'unrecognized_keys'
    if (issue.code === "unrecognized_keys") {
      // TypeScript sabe que 'keys' existe en este tipo de issue
      return { ...base, keys: issue.keys };
    }
    return base;
  });
}