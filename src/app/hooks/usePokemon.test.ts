// @vitest-environment jsdom
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PokemonEntity } from '@/domain/models';
import { buildPikachuEntity } from '@/tests/fixtures/pikachu';
import { usePokemon, type UsePokemonResult } from './usePokemon';

const mocks = vi.hoisted(() => ({
  getPokemonById: vi.fn(),
  getPokemonByName: vi.fn(),
}));

vi.mock('@/services', () => ({
  PokemonService: vi.fn().mockImplementation(function () {
    return {
      getPokemonById: mocks.getPokemonById,
      getPokemonByName: mocks.getPokemonByName,
    };
  }),
}));

describe('usePokemon', () => {
  beforeEach(() => {
    mocks.getPokemonById.mockReset();
    mocks.getPokemonByName.mockReset();
  });

  it('returns loading while pending and the pokemon once resolved', async () => {
    const entity = buildPikachuEntity();
    let resolvePikachu!: (value: PokemonEntity) => void;
    mocks.getPokemonById.mockImplementation(
      () => new Promise<PokemonEntity>(resolve => (resolvePikachu = resolve))
    );

    const { result } = renderHook(() => usePokemon(25));

    expect(result.current.loading).toBe(true);
    expect(result.current.pokemon).toBeNull();
    expect(result.current.error).toBeNull();

    act(() => resolvePikachu(entity));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.pokemon).toBe(entity);
  });

  it('uses getPokemonByName for string arguments', async () => {
    mocks.getPokemonByName.mockResolvedValue(buildPikachuEntity());

    renderHook(() => usePokemon('pikachu'));

    await waitFor(() => expect(mocks.getPokemonByName).toHaveBeenCalled());
    expect(mocks.getPokemonByName).toHaveBeenCalledWith('pikachu', expect.any(AbortSignal));
  });

  it('exposes the error when the request fails', async () => {
    mocks.getPokemonById.mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => usePokemon(25));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toEqual(new Error('boom'));
    expect(result.current.pokemon).toBeNull();
  });

  it('aborts the request signal when the component unmounts', () => {
    let capturedSignal: AbortSignal | undefined;
    mocks.getPokemonById.mockImplementation((_id: number, signal: AbortSignal) => {
      capturedSignal = signal;
      return new Promise<PokemonEntity>(() => undefined);
    });

    const { unmount } = renderHook(() => usePokemon(25));

    expect(capturedSignal?.aborted).toBe(false);
    unmount();
    expect(capturedSignal?.aborted).toBe(true);
  });

  it('refetches when nameOrId changes', async () => {
    mocks.getPokemonById.mockResolvedValue(buildPikachuEntity());
    mocks.getPokemonByName.mockResolvedValue(buildPikachuEntity());

    const { result, rerender } = renderHook<UsePokemonResult, { id: string | number }>(
      ({ id }) => usePokemon(id),
      { initialProps: { id: 25 } }
    );

    await waitFor(() => expect(result.current.pokemon).not.toBeNull());

    rerender({ id: 'pikachu' });

    await waitFor(() => expect(mocks.getPokemonByName).toHaveBeenCalled());
  });
});
