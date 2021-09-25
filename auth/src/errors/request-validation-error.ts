import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

// interface CustomError {
//   statusCode: number;
//   serializeErrors(): { message: string; field?: string }[];
// }

// // custom validation error
// export class RequestValidationError extends Error implements CustomError {
//   statusCode: number = 400;
//   // errors: ValidationError[];
//   // constructor(errors: ValidationError[]) {
//   //   super();
//   //   this.errors = errors;
//   // }

//   // same as above
//   constructor(public errors: ValidationError[]) {
//     super();

//     // we only have to do this when writing TS and extending a built in JS class
//     Object.setPrototypeOf(this, RequestValidationError.prototype);
//   }

//   serializeErrors() {
//     return this.errors.map(error => {
//       return { message: error.msg, field: error.param };
//     });
//   }
// }

export class RequestValidationError extends CustomError {
  statusCode: number = 400;
  constructor(public errors: ValidationError[]) {
    // this is for logging purposes and would not be sent out to users
    super("Invalid request parameters");
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map(error => {
      return { message: error.msg, field: error.param };
    });
  }
}
