export type ErrorResponse = {
  status: number;
  error: string;
  message: string;
  validationErrors: {
    [key: string]: string[];
  };
};
