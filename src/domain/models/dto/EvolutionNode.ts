export interface IEvolutionNode {
  id: number;
  name: string;
  spriteUrl: string;
  trigger: string | null;
  minLevel: number | null;
  item: string | null;
  minHappiness: number | null;
  timeOfDay: string | null;
  knownMove: string | null;
  location: string | null;
  gender: string | null;
  heldItem: string | null;
  tradeSpecies: string | null;
  evolvesTo: IEvolutionNode[] | null;
}

// NOTE: consider add evolvesFrom to this interface
