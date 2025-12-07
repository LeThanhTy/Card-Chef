
import { CardDef, CardType, CardCategory, Recipe, GameState } from './types';

// --- Card Definitions ---

export const CARDS: Record<string, CardDef> = {
  // --- TOOLS (Category: TOOL) ---
  'tool_board': { id: 'tool_board', name: 'Cutting Board', type: CardType.TOOL, category: CardCategory.TOOL, iconName: 'Square', color: 'bg-amber-600' },
  'tool_knife': { id: 'tool_knife', name: 'Knife', type: CardType.TOOL, category: CardCategory.TOOL, iconName: 'Sword', color: 'bg-gray-300', textColor: 'text-slate-900' }, 
  'tool_pan': { id: 'tool_pan', name: 'Frying Pan', type: CardType.TOOL, category: CardCategory.TOOL, iconName: 'CircleDot', color: 'bg-slate-500' },
  'tool_pot': { id: 'tool_pot', name: 'Pot', type: CardType.TOOL, category: CardCategory.TOOL, iconName: 'CupSoda', color: 'bg-slate-400' },
  'tool_stove': { id: 'tool_stove', name: 'Stove', type: CardType.TOOL, category: CardCategory.TOOL, iconName: 'Flame', color: 'bg-red-600' },
  'tool_bowl': { id: 'tool_bowl', name: 'Mixing Bowl', type: CardType.TOOL, category: CardCategory.TOOL, iconName: 'Soup', color: 'bg-blue-200', textColor: 'text-slate-900' },
  'tool_oven': { id: 'tool_oven', name: 'Oven', type: CardType.TOOL, category: CardCategory.TOOL, iconName: 'Microwave', color: 'bg-orange-600' },
  'tool_blender': { id: 'tool_blender', name: 'Blender', type: CardType.TOOL, category: CardCategory.TOOL, iconName: 'GlassWater', color: 'bg-cyan-500' },

  // --- ANIMAL INGREDIENTS ---
  'ing_meat': { id: 'ing_meat', name: 'Meat', type: CardType.INGREDIENT, category: CardCategory.ANIMAL, iconName: 'Beef', color: 'bg-red-400' },
  'ing_egg': { id: 'ing_egg', name: 'Egg', type: CardType.INGREDIENT, category: CardCategory.ANIMAL, iconName: 'Egg', color: 'bg-yellow-200', textColor: 'text-slate-900' },
  'ing_fish': { id: 'ing_fish', name: 'Fish', type: CardType.INGREDIENT, category: CardCategory.ANIMAL, iconName: 'Fish', color: 'bg-blue-400' },
  'ing_milk': { id: 'ing_milk', name: 'Milk', type: CardType.INGREDIENT, category: CardCategory.ANIMAL, iconName: 'Milk', color: 'bg-blue-100', textColor: 'text-slate-900' },
  'ing_cheese': { id: 'ing_cheese', name: 'Cheese', type: CardType.INGREDIENT, category: CardCategory.ANIMAL, iconName: 'Slice', color: 'bg-yellow-400' },
  'ing_chicken': { id: 'ing_chicken', name: 'Chicken', type: CardType.INGREDIENT, category: CardCategory.ANIMAL, iconName: 'Drumstick', color: 'bg-orange-300' },
  'ing_shrimp': { id: 'ing_shrimp', name: 'Shrimp', type: CardType.INGREDIENT, category: CardCategory.ANIMAL, iconName: 'Snail', color: 'bg-pink-300' },
  'ing_bacon': { id: 'ing_bacon', name: 'Bacon', type: CardType.INGREDIENT, category: CardCategory.ANIMAL, iconName: 'Waves', color: 'bg-red-300' },
  'ing_butter': { id: 'ing_butter', name: 'Butter', type: CardType.INGREDIENT, category: CardCategory.ANIMAL, iconName: 'Eraser', color: 'bg-yellow-300', textColor: 'text-slate-900' },

  // --- PLANT INGREDIENTS ---
  'ing_veg': { id: 'ing_veg', name: 'Greens', type: CardType.INGREDIENT, category: CardCategory.PLANT, iconName: 'Carrot', color: 'bg-green-500' },
  'ing_rice': { id: 'ing_rice', name: 'Rice', type: CardType.INGREDIENT, category: CardCategory.PLANT, iconName: 'Circle', color: 'bg-white', textColor: 'text-slate-900' },
  'ing_flour': { id: 'ing_flour', name: 'Flour', type: CardType.INGREDIENT, category: CardCategory.PLANT, iconName: 'Wheat', color: 'bg-amber-100', textColor: 'text-slate-900' },
  'ing_bread': { id: 'ing_bread', name: 'Bread', type: CardType.INGREDIENT, category: CardCategory.PLANT, iconName: 'Sandwich', color: 'bg-amber-600' },
  'ing_tomato': { id: 'ing_tomato', name: 'Tomato', type: CardType.INGREDIENT, category: CardCategory.PLANT, iconName: 'Tomato', color: 'bg-red-500' },
  'ing_potato': { id: 'ing_potato', name: 'Potato', type: CardType.INGREDIENT, category: CardCategory.PLANT, iconName: 'Cookie', color: 'bg-amber-300' }, 
  'ing_pasta': { id: 'ing_pasta', name: 'Pasta', type: CardType.INGREDIENT, category: CardCategory.PLANT, iconName: 'Codesandbox', color: 'bg-yellow-300' }, 
  'ing_sugar': { id: 'ing_sugar', name: 'Sugar', type: CardType.INGREDIENT, category: CardCategory.PLANT, iconName: 'Candy', color: 'bg-pink-100', textColor: 'text-slate-900' },
  'ing_chocolate': { id: 'ing_chocolate', name: 'Chocolate', type: CardType.INGREDIENT, category: CardCategory.PLANT, iconName: 'Square', color: 'bg-stone-700' },
  'ing_lettuce': { id: 'ing_lettuce', name: 'Lettuce', type: CardType.INGREDIENT, category: CardCategory.PLANT, iconName: 'Leaf', color: 'bg-green-300' },
  'ing_onion': { id: 'ing_onion', name: 'Onion', type: CardType.INGREDIENT, category: CardCategory.PLANT, iconName: 'CircleDashed', color: 'bg-purple-200', textColor: 'text-slate-900' },
  'ing_corn': { id: 'ing_corn', name: 'Corn', type: CardType.INGREDIENT, category: CardCategory.PLANT, iconName: 'Grid3X3', color: 'bg-yellow-400' },
  'ing_lemon': { id: 'ing_lemon', name: 'Lemon', type: CardType.INGREDIENT, category: CardCategory.PLANT, iconName: 'Circle', color: 'bg-yellow-300' },
  'ing_garlic': { id: 'ing_garlic', name: 'Garlic', type: CardType.INGREDIENT, category: CardCategory.PLANT, iconName: 'Triangle', color: 'bg-stone-200', textColor: 'text-slate-900' },
  'ing_strawberry': { id: 'ing_strawberry', name: 'Berry', type: CardType.INGREDIENT, category: CardCategory.PLANT, iconName: 'Hexagon', color: 'bg-red-600' },
};

export const CARD_PACK_COST = 50;
export const XP_BASE = 100;
export const INGREDIENT_SELL_VALUE = 10;

export const TOOL_PRICES: Record<string, number> = {
  'tool_board': 100,
  'tool_knife': 100,
  'tool_bowl': 100,
  'tool_pan': 200,
  'tool_stove': 400,
  'tool_pot': 200,
  'tool_oven': 800,
  'tool_blender': 600,
};

export const TOOL_UNLOCK_LEVELS: Record<string, number> = {
  'tool_board': 1,
  'tool_knife': 1,
  'tool_bowl': 1,
  'tool_pan': 2,
  'tool_stove': 2,
  'tool_pot': 3,
  'tool_oven': 5,
  'tool_blender': 6,
};

// --- Recipes ---
export const RECIPES: Recipe[] = [
  // --- Level 1: Basics ---
  {
    id: 'salad',
    name: 'Simple Salad',
    requiredLevel: 1,
    ingredients: ['tool_bowl', 'ing_veg'],
    reward: 15,
    xp: 10
  },
  {
    id: 'caesar_salad',
    name: 'Caesar Salad',
    requiredLevel: 1,
    ingredients: ['tool_bowl', 'ing_lettuce', 'ing_cheese', 'ing_bread'],
    reward: 35,
    xp: 25
  },
  {
    id: 'sushi',
    name: 'Sushi Roll',
    requiredLevel: 1,
    ingredients: ['tool_board', 'ing_rice', 'ing_fish', 'tool_knife'],
    reward: 30,
    xp: 25
  },
  {
    id: 'shrimp_sushi',
    name: 'Shrimp Sushi',
    requiredLevel: 1,
    ingredients: ['tool_board', 'ing_rice', 'ing_shrimp', 'tool_knife'],
    reward: 35,
    xp: 30
  },
  
  // --- Level 2: Frying ---
  {
    id: 'fried_egg',
    name: 'Fried Egg',
    requiredLevel: 2,
    ingredients: ['tool_pan', 'ing_egg', 'tool_stove'],
    reward: 20,
    xp: 15
  },
  {
    id: 'bacon_eggs',
    name: 'Bacon & Eggs',
    requiredLevel: 2,
    ingredients: ['tool_pan', 'ing_bacon', 'ing_egg', 'tool_stove'],
    reward: 40,
    xp: 30
  },
  {
    id: 'steak',
    name: 'Steak',
    requiredLevel: 2,
    ingredients: ['tool_board', 'ing_meat', 'tool_knife', 'tool_pan', 'tool_stove'],
    reward: 50,
    xp: 40
  },
  {
    id: 'butter_corn',
    name: 'Butter Corn',
    requiredLevel: 2,
    ingredients: ['tool_pan', 'ing_corn', 'ing_butter', 'tool_stove'],
    reward: 35,
    xp: 25
  },

  // --- Level 3: Boiling ---
  {
    id: 'boiled_veg',
    name: 'Boiled Veggies',
    requiredLevel: 3,
    ingredients: ['tool_pot', 'ing_veg', 'tool_stove'],
    reward: 25,
    xp: 20
  },
  {
    id: 'corn_soup',
    name: 'Corn Soup',
    requiredLevel: 3,
    ingredients: ['tool_pot', 'ing_corn', 'ing_milk', 'tool_stove'],
    reward: 40,
    xp: 30
  },
  {
    id: 'onion_soup',
    name: 'Onion Soup',
    requiredLevel: 3,
    ingredients: ['tool_pot', 'ing_onion', 'ing_cheese', 'ing_bread', 'tool_stove'],
    reward: 60,
    xp: 45
  },
  {
    id: 'tomato_soup',
    name: 'Tomato Soup',
    requiredLevel: 3,
    ingredients: ['tool_board', 'ing_tomato', 'tool_knife', 'tool_pot', 'tool_stove'],
    reward: 40,
    xp: 35
  },

  // --- Level 4: Complex Stacks ---
  {
    id: 'fish_soup',
    name: 'Fish Soup',
    requiredLevel: 4,
    ingredients: ['tool_board', 'ing_fish', 'tool_knife', 'tool_pot', 'ing_milk', 'tool_stove'],
    reward: 70,
    xp: 50
  },
  {
    id: 'pancake',
    name: 'Pancakes',
    requiredLevel: 4,
    ingredients: ['tool_bowl', 'ing_flour', 'ing_milk', 'ing_egg', 'tool_pan', 'tool_stove'],
    reward: 60,
    xp: 45
  },
  {
    id: 'shrimp_pasta',
    name: 'Shrimp Pasta',
    requiredLevel: 4,
    ingredients: ['tool_pot', 'ing_pasta', 'ing_shrimp', 'ing_tomato', 'tool_stove'],
    reward: 80,
    xp: 60
  },
  {
    id: 'cheeseburger',
    name: 'Cheeseburger',
    requiredLevel: 4,
    ingredients: ['ing_bread', 'tool_pan', 'ing_meat', 'tool_stove', 'ing_cheese', 'ing_bread'],
    reward: 90,
    xp: 70
  },

  // --- Level 5: Oven ---
  {
    id: 'pizza',
    name: 'Pizza',
    requiredLevel: 5,
    ingredients: ['ing_flour', 'ing_tomato', 'ing_cheese', 'ing_meat', 'tool_oven'],
    reward: 120,
    xp: 100
  },
  {
    id: 'garlic_bread',
    name: 'Garlic Bread',
    requiredLevel: 5,
    ingredients: ['tool_oven', 'ing_bread', 'ing_butter', 'ing_garlic'],
    reward: 70,
    xp: 50
  },
  {
    id: 'chicken_roast',
    name: 'Roast Chicken',
    requiredLevel: 5,
    ingredients: ['tool_board', 'ing_chicken', 'ing_potato', 'ing_garlic', 'tool_knife', 'tool_oven'],
    reward: 130,
    xp: 110
  },
  {
    id: 'lemon_pie',
    name: 'Lemon Pie',
    requiredLevel: 5,
    ingredients: ['tool_oven', 'ing_flour', 'ing_sugar', 'ing_lemon', 'ing_egg'],
    reward: 100,
    xp: 80
  },

  // --- Level 6: Blender ---
  {
    id: 'cake',
    name: 'Sponge Cake',
    requiredLevel: 6,
    ingredients: ['tool_bowl', 'ing_flour', 'ing_sugar', 'ing_egg', 'tool_oven'],
    reward: 100,
    xp: 80
  },
  {
    id: 'strawberry_cake',
    name: 'Berry Cake',
    requiredLevel: 6,
    ingredients: ['tool_bowl', 'ing_flour', 'ing_sugar', 'ing_egg', 'ing_strawberry', 'tool_oven'],
    reward: 120,
    xp: 95
  },
  {
    id: 'strawberry_shake',
    name: 'Berry Shake',
    requiredLevel: 6,
    ingredients: ['ing_milk', 'ing_strawberry', 'ing_sugar', 'tool_blender'],
    reward: 85,
    xp: 65
  },
  {
    id: 'chocolate_shake',
    name: 'Choco Shake',
    requiredLevel: 6,
    ingredients: ['ing_milk', 'ing_chocolate', 'ing_sugar', 'tool_blender'],
    reward: 80,
    xp: 60
  },

  // --- Level 7: Master ---
  {
    id: 'pasta_bolognese',
    name: 'Pasta Bolognese',
    requiredLevel: 7,
    ingredients: ['tool_pot', 'ing_pasta', 'tool_stove', 'tool_pan', 'ing_meat', 'ing_tomato', 'tool_stove'],
    reward: 150,
    xp: 150
  },
];

export const INITIAL_GAME_STATE: GameState = {
  money: 100,
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  stacks: [
    { id: 'start_board', x: 60, y: 300, rotation: -5, cards: [{ instanceId: 'i_board', defId: 'tool_board' }] },
    { id: 'start_knife', x: 160, y: 300, rotation: 5, cards: [{ instanceId: 'i_knife', defId: 'tool_knife' }] },
    { id: 'start_bowl', x: 260, y: 300, rotation: -2, cards: [{ instanceId: 'i_bowl', defId: 'tool_bowl' }] },
  ],
  customers: [],
  unlockedRecipes: ['salad', 'caesar_salad', 'sushi', 'shrimp_sushi'],
  notification: 'Welcome! Buy a Plant or Farm Pack to start.',
};
