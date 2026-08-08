import type { IPokemon, IPokemonListResponse } from '@/domain/models';
import type { CancellationSignal } from './CancellationSignal';

export interface IPokemonRepository {
  getPokemonById(id: number, signal?: CancellationSignal): Promise<IPokemon>;
  getPokemonByName(name: string, signal?: CancellationSignal): Promise<IPokemon>;
  getPokemonList(
    offset: number,
    limit: number,
    signal?: CancellationSignal
  ): Promise<IPokemonListResponse>;
}
