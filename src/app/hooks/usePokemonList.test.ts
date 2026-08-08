// @vitest-environment jsdom
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IPokemonListResponse } from '@/domain/models';
import { usePokemonList } from './usePokemonList';

const mocks = vi.hoisted(() => ({
  getPokemonList: vi.fn(),
}));

vi.mock('@/services', () => ({
  PokemonService: vi.fn().mockImplementation(function () {
    return {
      getPokemonList: mocks.getPokemonList,
    };
  }),
}));

function buildListResponse(): IPokemonListResponse {
  return {
    items: [
      { id: 25, name: 'pikachu', spriteUrl: 'https://example.com/pikachu.png', types: ['electric'] },
    ],
    total: 1,
    offset: 0,
    limit: 20,
    hasNext: false,
    hasPrevious: false,
  };
}

describe('usePokemonList', () => {
  beforeEach(() => {
    mocks.getPokemonList.mockReset();
  });

  it('returns loading while pending and the list once resolved', async () => {
    const list = buildListResponse();
    let resolveList!: (value: IPokemonListResponse) => void;
    mocks.getPokemonList.mockImplementation(
      () => new Promise<IPokemonListResponse>(resolve => (resolveList = resolve))
    );

    const { result } = renderHook(() => usePokemonList(0, 20));

    expect(result.current.loading).toBe(true);
    expect(result.current.pokemonList).toBeNull();
    expect(result.current.error).toBeNull();

    act(() => resolveList(list));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.pokemonList).toBe(list);
  });

  it('calls getPokemonList with offset, limit and the abort signal', async () => {
    mocks.getPokemonList.mockResolvedValue(buildListResponse());

    renderHook(() => usePokemonList(40, 10));

    await waitFor(() => expect(mocks.getPokemonList).toHaveBeenCalled());
    expect(mocks.getPokemonList).toHaveBeenCalledWith(40, 10, expect.any(AbortSignal));
  });

  it('exposes the error when the request fails', async () => {
    mocks.getPokemonList.mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => usePokemonList(0, 20));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toEqual(new Error('boom'));
    expect(result.current.pokemonList).toBeNull();
  });

  it('aborts the request signal when the component unmounts', () => {
    let capturedSignal: AbortSignal | undefined;
    mocks.getPokemonList.mockImplementation((_offset: number, _limit: number, signal: AbortSignal) => {
      capturedSignal = signal;
      return new Promise<IPokemonListResponse>(() => undefined);
    });

    const { unmount } = renderHook(() => usePokemonList(0, 20));

    expect(capturedSignal?.aborted).toBe(false);
    unmount();
    expect(capturedSignal?.aborted).toBe(true);
  });
});
