import { RepositoryError } from '@/domain/errors';

export class NetworkError extends RepositoryError {
  constructor(originalError?: unknown) {
    super('Network error: unable to reach the API', originalError);
    this.name = 'NetworkError';
  }
}
