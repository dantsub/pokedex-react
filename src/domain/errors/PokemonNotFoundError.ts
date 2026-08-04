import { RepositoryError } from './RepositoryError';

export class PokemonNotFoundError extends RepositoryError {
  readonly identifier: string | number;
  constructor(identifier: string | number) {
    super(`Pokemon with identifier "${identifier}" not found`);
    this.name = 'PokemonNotFoundError';
    this.identifier = identifier;
  }
}
