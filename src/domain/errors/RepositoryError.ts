export class RepositoryError extends Error {
  readonly originalError: unknown;

  constructor(message: string, originalError?: unknown) {
    super(message);
    this.name = 'RepositoryError';
    this.originalError = originalError;
  }
}
