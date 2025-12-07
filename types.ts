
export enum CardType {
  INGREDIENT = 'INGREDIENT',
  TOOL = 'TOOL',
}

export enum CardCategory {
  TOOL = 'TOOL',
  PLANT = 'PLANT',
  ANIMAL = 'ANIMAL',
  MISC = 'MISC'
}

export interface CardDef {
  id: string;
  name: string;
  type: CardType;
  category: CardCategory; // New field
  iconName: string; // Lucide icon name mapping
  color: string;
  cost?: number; // Internal value (rarity)
  textColor?: string;
}

// A single instance of a card in the game world
export interface GameCard {
  instanceId: string;
  defId: string;
}

// A stack of cards (or a single card) at a specific position
export interface CardStack {
  id: string;
  x: number;
  y: number;
  rotation: number; // visual rotation in degrees
  cards: GameCard[]; // Bottom to Top order
  isDragging?: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  requiredLevel: number;
  ingredients: string[]; // Order matters: Bottom -> Top
  reward: number;
  xp: number;
}

export interface Customer {
  id: string;
  name: string;
  orders: string[]; // Array of recipe IDs. Can contain duplicates.
  patience: number; // Placeholder for future features, currently infinite
  avatarId: number;
}

export interface GameState {
  money: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  stacks: CardStack[];
  customers: Customer[];
  unlockedRecipes: string[];
  notification: string | null;
}
