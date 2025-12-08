
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
    xp: 10,
    description: "A healthy start to your day. Fresh greens tossed in a wooden bowl.",
    difficulty: 'Easy',
    steps: ["Get a Mixing Bowl.", "Add Fresh Greens."]
  },
  {
    id: 'caesar_salad',
    name: 'Caesar Salad',
    requiredLevel: 1,
    ingredients: ['tool_bowl', 'ing_lettuce', 'ing_cheese', 'ing_bread'],
    reward: 35,
    xp: 25,
    description: "A classic salad with crunchy croutons and rich parmesan.",
    difficulty: 'Easy',
    steps: ["Prepare a Mixing Bowl.", "Add Crisp Lettuce.", "Grate some Cheese.", "Top with Bread chunks."]
  },
  {
    id: 'sushi',
    name: 'Sushi Roll',
    requiredLevel: 1,
    ingredients: ['tool_board', 'ing_rice', 'ing_fish', 'tool_knife'],
    reward: 30,
    xp: 25,
    description: "Fresh fish rolled in sticky rice. Knife skills required!",
    difficulty: 'Medium',
    steps: ["Lay Rice on Board.", "Add Fresh Fish.", "Use Knife to slice."]
  },
  {
    id: 'shrimp_sushi',
    name: 'Shrimp Sushi',
    requiredLevel: 1,
    ingredients: ['tool_board', 'ing_rice', 'ing_shrimp', 'tool_knife'],
    reward: 35,
    xp: 30,
    description: "Delicate shrimp atop vinegar rice.",
    difficulty: 'Medium',
    steps: ["Place Rice on Board.", "Layer Shrimp carefully.", "Cut with Knife."]
  },
  
  // --- Level 2: Frying ---
  {
    id: 'fried_egg',
    name: 'Fried Egg',
    requiredLevel: 2,
    ingredients: ['tool_pan', 'ing_egg', 'tool_stove'],
    reward: 20,
    xp: 15,
    description: "Sunny side up! A breakfast staple.",
    difficulty: 'Easy',
    steps: ["Heat up the Pan.", "Crack an Egg.", "Place on Stove to cook."]
  },
  {
    id: 'bacon_eggs',
    name: 'Bacon & Eggs',
    requiredLevel: 2,
    ingredients: ['tool_pan', 'ing_bacon', 'ing_egg', 'tool_stove'],
    reward: 40,
    xp: 30,
    description: "The ultimate breakfast combo. Smells delicious!",
    difficulty: 'Medium',
    steps: ["Put Bacon in Pan.", "Add an Egg.", "Cook on Stove."]
  },
  {
    id: 'steak',
    name: 'Steak',
    requiredLevel: 2,
    ingredients: ['tool_board', 'ing_meat', 'tool_knife', 'tool_pan', 'tool_stove'],
    reward: 50,
    xp: 40,
    description: "A juicy cut of beef, seared to perfection.",
    difficulty: 'Hard',
    steps: ["Place Meat on Board.", "Trim with Knife.", "Move to Pan.", "Sear on Stove."]
  },
  {
    id: 'butter_corn',
    name: 'Butter Corn',
    requiredLevel: 2,
    ingredients: ['tool_pan', 'ing_corn', 'ing_butter', 'tool_stove'],
    reward: 35,
    xp: 25,
    description: "Sweet corn sautéed in rich butter.",
    difficulty: 'Easy',
    steps: ["Add Corn to Pan.", "Melt Butter in.", "Sauté on Stove."]
  },

  // --- Level 3: Boiling ---
  {
    id: 'boiled_veg',
    name: 'Boiled Veggies',
    requiredLevel: 3,
    ingredients: ['tool_pot', 'ing_veg', 'tool_stove'],
    reward: 25,
    xp: 20,
    description: "Simple, nutritious, and warm.",
    difficulty: 'Easy',
    steps: ["Fill Pot with water.", "Add Vegetables.", "Boil on Stove."]
  },
  {
    id: 'corn_soup',
    name: 'Corn Soup',
    requiredLevel: 3,
    ingredients: ['tool_pot', 'ing_corn', 'ing_milk', 'tool_stove'],
    reward: 40,
    xp: 30,
    description: "Creamy, sweet, and comforting.",
    difficulty: 'Medium',
    steps: ["Start with Pot.", "Add Corn.", "Pour in Milk.", "Simmer on Stove."]
  },
  {
    id: 'onion_soup',
    name: 'Onion Soup',
    requiredLevel: 3,
    ingredients: ['tool_pot', 'ing_onion', 'ing_cheese', 'ing_bread', 'tool_stove'],
    reward: 60,
    xp: 45,
    description: "Rich savory broth with cheesy bread on top.",
    difficulty: 'Hard',
    steps: ["Pot ready.", "Add Onions.", "Top with Cheese.", "Add Bread.", "Cook on Stove."]
  },
  {
    id: 'tomato_soup',
    name: 'Tomato Soup',
    requiredLevel: 3,
    ingredients: ['tool_board', 'ing_tomato', 'tool_knife', 'tool_pot', 'tool_stove'],
    reward: 40,
    xp: 35,
    description: "Classic comfort food. Perfect for a rainy day.",
    difficulty: 'Medium',
    steps: ["Tomato on Board.", "Dice with Knife.", "Move to Pot.", "Cook on Stove."]
  },

  // --- Level 4: Complex Stacks ---
  {
    id: 'fish_soup',
    name: 'Fish Soup',
    requiredLevel: 4,
    ingredients: ['tool_board', 'ing_fish', 'tool_knife', 'tool_pot', 'ing_milk', 'tool_stove'],
    reward: 70,
    xp: 50,
    description: "A creamy seafood chowder.",
    difficulty: 'Hard',
    steps: ["Prep Fish on Board.", "Cut with Knife.", "Place in Pot.", "Add Milk.", "Boil on Stove."]
  },
  {
    id: 'pancake',
    name: 'Pancakes',
    requiredLevel: 4,
    ingredients: ['tool_bowl', 'ing_flour', 'ing_milk', 'ing_egg', 'tool_pan', 'tool_stove'],
    reward: 60,
    xp: 45,
    description: "Fluffy stack of golden goodness.",
    difficulty: 'Hard',
    steps: ["Bowl.", "Flour.", "Milk.", "Egg.", "Pour into Pan.", "Fry on Stove."]
  },
  {
    id: 'shrimp_pasta',
    name: 'Shrimp Pasta',
    requiredLevel: 4,
    ingredients: ['tool_pot', 'ing_pasta', 'ing_shrimp', 'ing_tomato', 'tool_stove'],
    reward: 80,
    xp: 60,
    description: "Seafood pasta in a rich tomato sauce.",
    difficulty: 'Hard',
    steps: ["Use Pot.", "Add Pasta.", "Add Shrimp.", "Add Tomato.", "Cook on Stove."]
  },
  {
    id: 'cheeseburger',
    name: 'Cheeseburger',
    requiredLevel: 4,
    ingredients: ['ing_bread', 'tool_pan', 'ing_meat', 'tool_stove', 'ing_cheese', 'ing_bread'],
    reward: 90,
    xp: 70,
    description: "A towering classic burger with melted cheese.",
    difficulty: 'Expert',
    steps: ["Bun base.", "Pan.", "Meat.", "Cook on Stove.", "Cheese.", "Top Bun."]
  },

  // --- Level 5: Oven ---
  {
    id: 'pizza',
    name: 'Pizza',
    requiredLevel: 5,
    ingredients: ['ing_flour', 'ing_tomato', 'ing_cheese', 'ing_meat', 'tool_oven'],
    reward: 120,
    xp: 100,
    description: "Everyone's favorite! Cheesy and meat-packed.",
    difficulty: 'Expert',
    steps: ["Dough (Flour).", "Tomato Sauce.", "Cheese Layer.", "Meat Topping.", "Bake in Oven."]
  },
  {
    id: 'garlic_bread',
    name: 'Garlic Bread',
    requiredLevel: 5,
    ingredients: ['tool_oven', 'ing_bread', 'ing_butter', 'ing_garlic'],
    reward: 70,
    xp: 50,
    description: "Crispy bread infused with garlic butter.",
    difficulty: 'Medium',
    steps: ["Start with Oven.", "Add Bread.", "Smear Butter.", "Add Garlic."]
  },
  {
    id: 'chicken_roast',
    name: 'Roast Chicken',
    requiredLevel: 5,
    ingredients: ['tool_board', 'ing_chicken', 'ing_potato', 'ing_garlic', 'tool_knife', 'tool_oven'],
    reward: 130,
    xp: 110,
    description: "A festive feast with roasted sides.",
    difficulty: 'Expert',
    steps: ["Board.", "Chicken.", "Potato.", "Garlic.", "Prep with Knife.", "Roast in Oven."]
  },
  {
    id: 'lemon_pie',
    name: 'Lemon Pie',
    requiredLevel: 5,
    ingredients: ['tool_oven', 'ing_flour', 'ing_sugar', 'ing_lemon', 'ing_egg'],
    reward: 100,
    xp: 80,
    description: "Zesty, sweet, and perfectly baked.",
    difficulty: 'Hard',
    steps: ["Oven.", "Flour Crust.", "Sugar.", "Lemon Juice.", "Egg wash."]
  },

  // --- Level 6: Blender ---
  {
    id: 'cake',
    name: 'Sponge Cake',
    requiredLevel: 6,
    ingredients: ['tool_bowl', 'ing_flour', 'ing_sugar', 'ing_egg', 'tool_oven'],
    reward: 100,
    xp: 80,
    description: "Light, airy, and sweet.",
    difficulty: 'Hard',
    steps: ["Bowl.", "Flour.", "Sugar.", "Egg.", "Bake in Oven."]
  },
  {
    id: 'strawberry_cake',
    name: 'Berry Cake',
    requiredLevel: 6,
    ingredients: ['tool_bowl', 'ing_flour', 'ing_sugar', 'ing_egg', 'ing_strawberry', 'tool_oven'],
    reward: 120,
    xp: 95,
    description: "A sponge cake with fresh strawberries.",
    difficulty: 'Expert',
    steps: ["Bowl.", "Flour.", "Sugar.", "Egg.", "Strawberry.", "Bake."]
  },
  {
    id: 'strawberry_shake',
    name: 'Berry Shake',
    requiredLevel: 6,
    ingredients: ['ing_milk', 'ing_strawberry', 'ing_sugar', 'tool_blender'],
    reward: 85,
    xp: 65,
    description: "Cool and refreshing blended drink.",
    difficulty: 'Medium',
    steps: ["Milk.", "Strawberry.", "Sugar.", "Blend it."]
  },
  {
    id: 'chocolate_shake',
    name: 'Choco Shake',
    requiredLevel: 6,
    ingredients: ['ing_milk', 'ing_chocolate', 'ing_sugar', 'tool_blender'],
    reward: 80,
    xp: 60,
    description: "Rich chocolate goodness.",
    difficulty: 'Medium',
    steps: ["Milk.", "Chocolate.", "Sugar.", "Blend it."]
  },

  // --- Level 7: Master ---
  {
    id: 'pasta_bolognese',
    name: 'Pasta Bolognese',
    requiredLevel: 7,
    ingredients: ['tool_pot', 'ing_pasta', 'tool_stove', 'tool_pan', 'ing_meat', 'ing_tomato', 'tool_stove'],
    reward: 150,
    xp: 150,
    description: "The ultimate pasta dish. Complex and rewarding.",
    difficulty: 'Expert',
    steps: ["Boil Pasta (Pot+Stove).", "Fry Sauce (Pan+Meat+Tomato+Stove).", "Combine!"]
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
