export enum Http400ErrorCode {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  Conflict = 409,
  UnprocessableEntity = 422,
}

export function apiErrorResponse(
  status: Http400ErrorCode,
  errorClassName: string,
  message: string
) {
  return {
    status,
    success: false,
    data: {
      errorClassName,
      message,
    },
  };
}
