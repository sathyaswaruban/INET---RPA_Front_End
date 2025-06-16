export function successResponse(data: any) {
  return {
    isSuccess: true,
    data,
  };
}

export function errorResponse(message: string) {
  return {
    isSuccess: false,
    data: null,
    error: message,
  };
}
