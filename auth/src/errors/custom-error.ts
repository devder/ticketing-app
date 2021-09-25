// abstract classes are good subs for interfaces in the sense that when they are transpiled to JS,
// they still are classes unlike interfaces
export abstract class CustomError extends Error {
  abstract statusCode: number;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}
