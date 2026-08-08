import { PokeApiRepository } from '@/data/repositories/PokeApiRepository';
import type { IPokemonListResponse } from '@/domain/models';
import { PokemonService } from '@/services';
import { useEffect, useState } from 'react';

export interface UsePokemonListResult {
  pokemonList: IPokemonListResponse | null;
  loading: boolean;
  error: Error | null;
}

export const usePokemonList = (offset: number, limit: number): UsePokemonListResult => {
  const [pokemonList, setPokemonList] = useState<IPokemonListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const service = new PokemonService(new PokeApiRepository());

    async function load(): Promise<void> {
      setLoading(true);
      setError(null);
      try {
        const result = await service.getPokemonList(offset, limit, controller.signal);
        setPokemonList(result);
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => controller.abort();
  }, [offset, limit]);

  return { pokemonList, loading, error };
};
