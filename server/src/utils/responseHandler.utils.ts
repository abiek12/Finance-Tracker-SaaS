import { ErrorResponse, SuccessResponse } from "../types/response.types";

  export function successResponse<T>(
    statusCode: number = 200,
    data: T,
    message: string = "Successful",
  ): SuccessResponse<T> {
    return {
      success: true,
      statusCode,
      data,
      message,
    };
  }
  
  export function errorResponse(
    statusCode: number = 400,
    message: string,
    code: string = "ERROR",
    details: any = null,
  ): ErrorResponse {
    return {
      success: false,
      statusCode,
      error: {
        message,
        code,
        details,
      }
    };
  }
  