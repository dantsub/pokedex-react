import { RepositoryError } from '@/domain/errors';

export class ApiServerError extends RepositoryError {
  readonly statusCode: number;

  constructor(statusCode: number, originalError?: unknown) {
    super(`API server error with status ${statusCode}`, originalError);
    this.name = 'ApiServerError';
    this.statusCode = statusCode;
  }
}
