export default interface ApiResponse {
  statusCode?: number;
  isSuccess?: boolean;
  errorMessages?: Array<string>;
  result: any;
  error?: any;
}
