import { PokeApiRepository } from '@/data/repositories/PokeApiRepository';
import type { PokemonEntity } from '@/domain/models';
import { PokemonService } from '@/services';
import { useEffect, useState } from 'react';

export interface UsePokemonResult {
  pokemon: PokemonEntity | null;
  loading: boolean;
  error: Error | null;
}

export const usePokemon = (nameOrId: string | number): UsePokemonResult => {
  const [pokemon, setPokemon] = useState<PokemonEntity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const service = new PokemonService(new PokeApiRepository());

    async function load(): Promise<void> {
      setLoading(true);
      setError(null);
      try {
        const result =
          typeof nameOrId === 'number'
            ? await service.getPokemonById(nameOrId, controller.signal)
            : await service.getPokemonByName(nameOrId, controller.signal);
        setPokemon(result);
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
  }, [nameOrId]);

  return { pokemon, loading, error };
};
