import type { IPokemon, IPokemonListResponse } from '@/domain/models';

export interface IPokemonRepository {
  getPokemonById(id: number): Promise<IPokemon>;
  getPokemonByName(name: string): Promise<IPokemon>;
  getPokemonList(offset: number, limit: number): Promise<IPokemonListResponse>;
}
