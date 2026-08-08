import type { IEvolutionNode } from '@/domain/models';
import { buildSpriteUrl, extractIdFromResourceUrl } from './utils';
import type { RawEvolutionChain, RawEvolutionDetail, RawEvolutionNode } from './types';

function toEvolutionDetail(detail?: RawEvolutionDetail) {
  return {
    trigger: detail?.trigger?.name ?? null,
    minLevel: detail?.min_level ?? null,
    item: detail?.item?.name ?? null,
    minHappiness: detail?.min_happiness ?? null,
    timeOfDay: detail?.time_of_day ?? null,
    knownMove: detail?.known_move?.name ?? null,
    location: detail?.location?.name ?? null,
    gender: detail?.gender?.name ?? null,
    heldItem: detail?.held_item?.name ?? null,
    tradeSpecies: detail?.trade_species?.name ?? null,
  };
}

function toEvolutionNode(node: RawEvolutionNode): IEvolutionNode {
  const id = extractIdFromResourceUrl(node.species.url);

  return {
    id,
    name: node.species.name,
    spriteUrl: buildSpriteUrl(id),
    ...toEvolutionDetail(node.evolution_details[0]),
    evolvesTo: node.evolves_to.length > 0 ? node.evolves_to.map(toEvolutionNode) : null,
  };
}

function flattenEvolutions(nodes: IEvolutionNode[]): IEvolutionNode[] {
  const result: IEvolutionNode[] = [];
  for (const node of nodes) {
    result.push(node);
    if (node.evolvesTo) {
      result.push(...flattenEvolutions(node.evolvesTo));
    }
  }
  return result;
}

export function toEvolutionChain(chain: RawEvolutionChain): IEvolutionNode[] {
  return flattenEvolutions([toEvolutionNode(chain.chain)]);
}
