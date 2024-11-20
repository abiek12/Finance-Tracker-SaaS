export interface SuccessResponse<T> {
    success: true;
    data: T;
    message: string;
    statusCode: number;
}

export interface ErrorResponse {
    success: false;
    error: {
      message: string;
      code?: string;
      details?: any;
    };
    statusCode: number;
}