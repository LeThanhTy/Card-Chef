import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ShoppingBag, BookOpen, Star, ChefHat, Coins, User, Hammer, X, Clock, Receipt, Trash2, ArrowRight, XCircle, Leaf, Drumstick } from 'lucide-react';
import { 
  GameState, CardStack, GameCard, CardType, Recipe, Customer, CardCategory 
} from './types';
import { 
  CARDS, RECIPES, INITIAL_GAME_STATE, CARD_PACK_COST, XP_BASE, TOOL_PRICES, TOOL_UNLOCK_LEVELS, INGREDIENT_SELL_VALUE 
} from './constants';
import { CardStackComponent } from './components/CardStackComponent';

// --- Helper Functions ---
const generateId = () => Math.random().toString(36).substr(2, 9);

// Smart Ingredient Drop Logic
const getIngredientForLevel = (unlockedRecipeIds: string[], filterCategory: CardCategory): string => {
  const activeRecipes = RECIPES.filter(r => unlockedRecipeIds.includes(r.id));
  const neededIngredients = new Set<string>();
  
  activeRecipes.forEach(r => {
    r.ingredients.forEach(ingId => {
      const cardDef = CARDS[ingId];
      if (cardDef.type === CardType.INGREDIENT && cardDef.category === filterCategory) {
        neededIngredients.add(ingId);
      }
    });
  });

  let validIngredients = Array.from(neededIngredients);
  
  // Fallback 1: If no needed ingredients of this category, pick ANY ingredient of this category
  if (validIngredients.length === 0) {
      validIngredients = Object.keys(CARDS).filter(id => 
          CARDS[id].type === CardType.INGREDIENT && CARDS[id].category === filterCategory
      );
  }

  // Fallback 2: Should not happen unless config error, but just in case, pick any ingredient
  if (validIngredients.length === 0) {
      validIngredients = Object.keys(CARDS).filter(id => CARDS[id].type === CardType.INGREDIENT);
  }

  return validIngredients[Math.floor(Math.random() * validIngredients.length)];
};

const checkRecipeMatch = (stack: GameCard[], unlockedRecipes: string[]): Recipe | null => {
  const stackDefIds = stack.map(c => c.defId);
  const match = RECIPES.find(r => {
    if (!unlockedRecipes.includes(r.id)) return false;
    if (r.ingredients.length !== stackDefIds.length) return false;
    for (let i = 0; i < r.ingredients.length; i++) {
        if (r.ingredients[i] !== stackDefIds[i]) return false;
    }
    return true;
  });
  return match || null;
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [isRecipeBookOpen, setIsRecipeBookOpen] = useState(false);
  const [isToolShopOpen, setIsToolShopOpen] = useState(false);
  
  // Camera Pan State
  const [pan, setPan] = useState({ x: 0, y: 0 });
  
  // UI Refs for drop zones
  const sellBinRef = useRef<HTMLDivElement>(null);

  const dragRef = useRef<{
    activeId: string | null;
    isPanning: boolean;
    offsetX: number;
    offsetY: number;
    panStartX: number;
    panStartY: number;
    initialPanX: number;
    initialPanY: number;
  }>({ 
      activeId: null, 
      isPanning: false,
      offsetX: 0, 
      offsetY: 0, 
      panStartX: 0, 
      panStartY: 0,
      initialPanX: 0,
      initialPanY: 0
  });

  // --- Game Loop ---
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        let newCustomers = [...prev.customers];
        // Limit total customers to 3 to save space
        if (newCustomers.length < 3 && Math.random() < 0.3) {
            // Generate multiple orders
            const numOrders = Math.random() < 0.3 ? 2 : 1; // 30% chance of double order
            const orders: string[] = [];
            for (let i=0; i<numOrders; i++) {
                const recipeId = prev.unlockedRecipes[Math.floor(Math.random() * prev.unlockedRecipes.length)];
                orders.push(recipeId);
            }

            if (orders.length > 0) {
                newCustomers.push({
                    id: generateId(),
                    name: `Guest #${Math.floor(Math.random() * 100)}`,
                    orders: orders,
                    patience: 100,
                    avatarId: Math.floor(Math.random() * 5)
                });
            }
        }
        return { ...prev, customers: newCustomers };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // --- Auto-Dismiss Notification ---
  useEffect(() => {
    if (gameState.notification) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, notification: null }));
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [gameState.notification]);

  // --- Logic: Spawn Free Tools on Level Up ---
  const spawnToolsForLevel = (level: number): CardStack[] => {
      const newStacks: CardStack[] = [];
      // Spawn relative to current view center (Screen Center - Pan Offset)
      const cx = (window.innerWidth / 2) - pan.x;
      const cy = (window.innerHeight / 2) - pan.y;

      const spawnTool = (toolId: string, offsetX: number, offsetY: number) => {
          newStacks.push({
              id: generateId(), 
              x: cx + offsetX, 
              y: cy + offsetY, 
              rotation: Math.random() * 10 - 5,
              cards: [{ instanceId: generateId(), defId: toolId }],
              isDragging: false
          });
      };

      if (level === 2) {
          spawnTool('tool_pan', -60, 0);
          spawnTool('tool_stove', 60, 0);
      } else if (level === 3) {
          spawnTool('tool_pot', 0, 0);
      } else if (level === 5) {
          spawnTool('tool_oven', 0, 0);
      } else if (level === 6) {
          spawnTool('tool_blender', 0, 0);
      }
      return newStacks;
  };

  // --- Customer Actions ---

  const handleRejectCustomer = (customerId: string) => {
      setGameState(prev => ({
          ...prev,
          customers: prev.customers.filter(c => c.id !== customerId),
          notification: "Order Dismissed"
      }));
  };

  // --- Pointer Handlers ---

  const handleBackgroundPointerDown = (e: React.PointerEvent) => {
      dragRef.current.isPanning = true;
      dragRef.current.panStartX = e.clientX;
      dragRef.current.panStartY = e.clientY;
      dragRef.current.initialPanX = pan.x;
      dragRef.current.initialPanY = pan.y;
  };

  const handleCardPointerDown = (e: React.PointerEvent, stackId: string, cardIndex: number) => {
    e.preventDefault();
    e.stopPropagation(); // Stop bubbling to background

    setGameState(prev => {
      const sourceStack = prev.stacks.find(s => s.id === stackId);
      if (!sourceStack) return prev;

      let draggingStack: CardStack;
      let remainingStack: CardStack | null = null;
      let newStacksList = prev.stacks.filter(s => s.id !== stackId);

      if (cardIndex === 0) {
        draggingStack = { ...sourceStack, isDragging: true };
      } else {
        const remainingCards = sourceStack.cards.slice(0, cardIndex);
        const movingCards = sourceStack.cards.slice(cardIndex);
        remainingStack = { ...sourceStack, cards: remainingCards, isDragging: false };
        newStacksList.push(remainingStack);
        const visualOffsetY = cardIndex * -25;
        draggingStack = {
            id: generateId(),
            x: sourceStack.x,
            y: sourceStack.y + visualOffsetY,
            rotation: 0,
            cards: movingCards,
            isDragging: true
        };
      }
      newStacksList.push(draggingStack);
      
      // Calculate offset relative to the visual position (which includes pan)
      // Visual Position = World Position + Pan
      const visualX = draggingStack.x + pan.x;
      const visualY = draggingStack.y + pan.y;

      dragRef.current = {
        ...dragRef.current,
        activeId: draggingStack.id,
        offsetX: e.clientX - visualX,
        offsetY: e.clientY - visualY,
        isPanning: false
      };
      return { ...prev, stacks: newStacksList };
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // 1. Panning Logic
    if (dragRef.current.isPanning) {
        e.preventDefault();
        const dx = e.clientX - dragRef.current.panStartX;
        const dy = e.clientY - dragRef.current.panStartY;
        setPan({
            x: dragRef.current.initialPanX + dx,
            y: dragRef.current.initialPanY + dy
        });
        return;
    }

    // 2. Dragging Logic
    if (dragRef.current.activeId) {
        e.preventDefault();
        const { activeId, offsetX, offsetY } = dragRef.current;
        
        // Convert screen coordinates back to world coordinates
        // Screen = World + Pan  ->  World = Screen - Pan
        const worldX = (e.clientX - offsetX) - pan.x;
        const worldY = (e.clientY - offsetY) - pan.y;

        setGameState(prev => ({
        ...prev,
        stacks: prev.stacks.map(s => s.id === activeId ? { ...s, x: worldX, y: worldY } : s)
        }));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    // Stop Panning
    if (dragRef.current.isPanning) {
        dragRef.current.isPanning = false;
        return;
    }

    // Stop Dragging
    if (!dragRef.current.activeId) return;
    const activeId = dragRef.current.activeId;
    
    setGameState(prev => {
      const activeStack = prev.stacks.find(s => s.id === activeId);
      if (!activeStack) return prev;
      const stacksWithoutActive = prev.stacks.filter(s => s.id !== activeId);

      // --- 1. Check Sell Bin Collision (Screen Coordinates) ---
      if (sellBinRef.current) {
          const binRect = sellBinRef.current.getBoundingClientRect();
          // Visual position of the stack
          const stackVisualX = activeStack.x + pan.x + 48; 
          const stackVisualY = activeStack.y + pan.y + 64; 

          if (stackVisualX >= binRect.left && stackVisualX <= binRect.right &&
              stackVisualY >= binRect.top && stackVisualY <= binRect.bottom) {
              
              // Check if stack contains tools
              const hasTools = activeStack.cards.some(c => CARDS[c.defId].type === CardType.TOOL);
              
              if (hasTools) {
                  return {
                      ...prev,
                      notification: "Cannot sell Tools!",
                      stacks: [...stacksWithoutActive, { ...activeStack, isDragging: false }]
                  };
              } else {
                  // Sell
                  const value = activeStack.cards.length * INGREDIENT_SELL_VALUE;
                  return {
                      ...prev,
                      money: prev.money + value,
                      notification: `Sold ingredients for ${value}g`,
                      stacks: stacksWithoutActive // Stack removed
                  };
              }
          }
      }
      
      // --- 2. Check Stack Merge Collision (World Coordinates) ---
      let targetStack: CardStack | null = null;
      for (const s of stacksWithoutActive) {
        // Distance check in world space (pan irrelevant as both are in world space)
        if (Math.hypot(s.x - activeStack.x, s.y - activeStack.y) < 60) {
          targetStack = s;
          break;
        }
      }

      if (targetStack) {
        const newStackCards = [...targetStack.cards, ...activeStack.cards];
        const recipeMatch = checkRecipeMatch(newStackCards, prev.unlockedRecipes);
        
        if (recipeMatch) {
            // Find a customer who needs this recipe
            const customerIndex = prev.customers.findIndex(c => c.orders.includes(recipeMatch.id));
            
            let newMoney = prev.money;
            let newXp = prev.xp;
            let newCustomers = [...prev.customers];
            let notification = `Cooked ${recipeMatch.name}!`;

            if (customerIndex !== -1) {
                const customer = newCustomers[customerIndex];
                // Remove ONE instance of the order
                const orderIndex = customer.orders.indexOf(recipeMatch.id);
                const updatedOrders = [...customer.orders];
                updatedOrders.splice(orderIndex, 1);

                if (updatedOrders.length === 0) {
                    // Customer fulfilled
                    newCustomers.splice(customerIndex, 1);
                    notification = `Order Complete! +${recipeMatch.reward}g`;
                } else {
                    // Update customer with remaining orders
                    newCustomers[customerIndex] = { ...customer, orders: updatedOrders };
                    notification = `Dish Served! +${recipeMatch.reward}g`;
                }

                newMoney += recipeMatch.reward;
                newXp += recipeMatch.xp;
                
            } else {
                notification = `Cooked ${recipeMatch.name} (Wasted)`;
            }

            // XP Logic
            let newLevel = prev.level;
            let newXpToNext = prev.xpToNextLevel;
            let extraStacks: CardStack[] = [];

            if (newXp >= newXpToNext) {
                newLevel++;
                newXp -= newXpToNext;
                newXpToNext = Math.floor(newXpToNext * 1.5);
                notification += ` LEVEL UP! -> ${newLevel}`;
                
                extraStacks = spawnToolsForLevel(newLevel);
                if (extraStacks.length > 0) notification += " New Tools Unlocked!";
            }

            const updatedUnlocked = RECIPES.filter(r => r.requiredLevel <= newLevel).map(r => r.id);

            const toolsToReturn = newStackCards.filter(c => CARDS[c.defId].type === CardType.TOOL);
            const returnedToolStacks: CardStack[] = toolsToReturn.map((card) => ({
                id: generateId(),
                x: targetStack!.x + (Math.random() * 60 - 30),
                y: targetStack!.y + (Math.random() * 60 - 30),
                rotation: (Math.random() * 40 - 20),
                cards: [card],
                isDragging: false
            }));

            return {
                ...prev,
                money: newMoney,
                xp: newXp,
                level: newLevel,
                xpToNextLevel: newXpToNext,
                customers: newCustomers,
                stacks: [
                  ...stacksWithoutActive.filter(s => s.id !== targetStack!.id),
                  ...returnedToolStacks,
                  ...extraStacks
                ],
                unlockedRecipes: updatedUnlocked,
                notification
            };
        } else {
            const mergedStack = { ...targetStack, rotation: 0, cards: newStackCards, isDragging: false };
            return { ...prev, stacks: [...stacksWithoutActive.filter(s => s.id !== targetStack!.id), mergedStack] };
        }
      }
      return { ...prev, stacks: prev.stacks.map(s => s.id === activeId ? { ...s, isDragging: false } : s) };
    });
    dragRef.current = { activeId: null, isPanning: false, offsetX: 0, offsetY: 0, panStartX: 0, panStartY: 0, initialPanX: 0, initialPanY: 0 };
  };

  // --- Actions ---

  const buyPack = (category: CardCategory) => {
    if (gameState.money < CARD_PACK_COST) {
        setGameState(prev => ({ ...prev, notification: "Need more coins!" }));
        return;
    }

    const newStacks: CardStack[] = [];
    // Spawn in Center of View
    const cx = (window.innerWidth / 2) - pan.x;
    const cy = (window.innerHeight / 2) - pan.y;

    const cardsToSpawn: string[] = [];
    let attempts = 0;
    const maxDuplicates = 2;

    // Try to fill the pack ensuring no more than 2 duplicates
    while (cardsToSpawn.length < 5 && attempts < 50) {
        const candidate = getIngredientForLevel(gameState.unlockedRecipes, category);
        const count = cardsToSpawn.filter(c => c === candidate).length;
        if (count < maxDuplicates) {
            cardsToSpawn.push(candidate);
        }
        attempts++;
    }

    // Fallback
    while (cardsToSpawn.length < 5) {
        cardsToSpawn.push(getIngredientForLevel(gameState.unlockedRecipes, category));
    }

    for (const defId of cardsToSpawn) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 60 + Math.random() * 100;

        const rawX = cx + Math.cos(angle) * radius;
        const rawY = cy + Math.sin(angle) * radius;
        
        newStacks.push({
            id: generateId(), x: rawX, y: rawY, rotation: (Math.random() * 50) - 25,
            cards: [{ instanceId: generateId(), defId }],
            isDragging: false
        });
    }

    const typeName = category === CardCategory.PLANT ? "Plant" : "Farm";
    setGameState(prev => ({
        ...prev,
        money: prev.money - CARD_PACK_COST,
        stacks: [...prev.stacks, ...newStacks],
        notification: `${typeName} Pack Opened!`
    }));
  };

  const buyTool = (toolId: string) => {
    const cost = TOOL_PRICES[toolId] || 999;
    if (gameState.money < cost) {
      setGameState(prev => ({ ...prev, notification: "Too expensive!" }));
      return;
    }
    const newStack: CardStack = {
      id: generateId(),
      x: (window.innerWidth / 2) - 48 - pan.x + (Math.random() * 40 - 20),
      y: (window.innerHeight / 2) - 64 - pan.y + (Math.random() * 40 - 20),
      rotation: 0,
      cards: [{ instanceId: generateId(), defId: toolId }],
      isDragging: false
    };
    setGameState(prev => ({
      ...prev,
      money: prev.money - cost,
      stacks: [...prev.stacks, newStack],
      notification: `Bought ${CARDS[toolId].name}!`
    }));
  };

  return (
    <div 
      className="w-screen h-screen bg-stone-100 overflow-hidden relative select-none font-sans"
      onPointerDown={handleBackgroundPointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
        {/* Kitchen Tile Background - Moves with Pan */}
        <div 
            className="absolute inset-0 pointer-events-none"
            style={{
                backgroundImage: `
                    conic-gradient(
                        #f7f6f5 90deg, 
                        #ffffff 90deg 180deg, 
                        #f7f6f5 180deg 270deg, 
                        #ffffff 270deg
                    )
                `,
                backgroundSize: '100px 100px',
                backgroundPosition: `${pan.x}px ${pan.y}px`
            }}
        ></div>

        {/* --- Top Unified Stats Bar --- */}
        <div 
          className="absolute top-0 left-0 w-full h-14 bg-white/95 backdrop-blur-md border-b-4 border-slate-200 z-50 flex items-center justify-between px-4 shadow-sm"
          onPointerDown={(e) => e.stopPropagation()}
        >
             {/* Left: Level & XP */}
             <div className="flex items-center gap-3">
                <div className="relative group cursor-help">
                    <Star size={36} className="text-yellow-500 fill-yellow-500 drop-shadow-sm" />
                    <span className="absolute inset-0 flex items-center justify-center font-black text-xs text-white pt-1">{gameState.level}</span>
                </div>
                <div className="flex flex-col w-24 md:w-48">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                        <span>XP</span>
                        <span>{gameState.xp}/{gameState.xpToNextLevel}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden border border-slate-300">
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full transition-all duration-500" style={{ width: `${(gameState.xp / gameState.xpToNextLevel) * 100}%` }}></div>
                    </div>
                </div>
             </div>

             {/* Right: Money */}
             <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1.5 rounded-full border-2 border-yellow-200 shadow-sm">
                 <Coins size={20} className="text-yellow-600" />
                 <span className="font-black text-lg text-yellow-800 leading-none">{gameState.money}</span>
             </div>
        </div>

        {/* --- Top: Customer Tickets Rail --- */}
        <div 
            className="absolute top-16 left-0 w-full z-30 flex justify-center md:pl-0 pl-0"
            onPointerDown={(e) => e.stopPropagation()} // Prevent pan when touching UI
        >
             {/* Rail Graphic */}
            <div className="w-full md:w-3/4 h-3 bg-gray-400 border-b-2 border-gray-500 rounded-b-sm shadow-md absolute top-0 pointer-events-none"></div>
            
            {/* Scrollable Container for tickets */}
            <div className="flex gap-2 md:gap-4 pt-4 overflow-x-auto px-4 w-full justify-start md:justify-center pb-4 no-scrollbar">
                {gameState.customers.map((customer, i) => {
                    return (
                        <div key={customer.id} 
                                className="relative flex-shrink-0 bg-white w-32 sm:w-40 md:w-48 p-2 md:p-3 shadow-xl transform transition-transform hover:scale-[1.02] origin-top border border-gray-200 flex flex-col gap-2 rounded-sm group"
                                style={{ minHeight: '130px' }}
                        >
                                {/* Tape / Pin */}
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500 border border-red-700 shadow-sm z-10"></div>

                                {/* Dismiss Button */}
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRejectCustomer(customer.id);
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 hover:scale-110 transition-all z-20 border border-white"
                                    title="Dismiss Order"
                                >
                                    <X size={12} />
                                </button>
                                
                                {/* Header */}
                                <div className="border-b-2 border-dotted border-gray-300 pb-1 mb-1 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">TICKET #{customer.id.substr(0,3)}</span>
                                </div>
                                
                                {/* Order List */}
                                <div className="flex flex-col gap-2 flex-1">
                                    {customer.orders.map((recipeId, idx) => {
                                        const recipe = RECIPES.find(r => r.id === recipeId);
                                        if (!recipe) return null;
                                        return (
                                            <div key={idx} className="bg-gray-50 rounded p-1.5 border border-gray-100">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs md:text-sm font-black text-slate-800 leading-none truncate pr-1">{recipe.name}</span>
                                                    <span className="text-[8px] md:text-[10px] font-bold text-green-600 bg-green-100 px-1 rounded flex-shrink-0">+{recipe.reward}</span>
                                                </div>
                                                
                                                {/* Clean Ingredient Tags */}
                                                <div className="flex flex-wrap gap-1">
                                                    {recipe.ingredients.map((ing, ingIdx) => {
                                                        const def = CARDS[ing];
                                                        if (!def) return null;
                                                        const isTool = def.type === CardType.TOOL;
                                                        return (
                                                            <div key={ingIdx} className={`h-4 px-1 rounded-[3px] ${def.color} flex items-center justify-center border border-black/10`} title={def.name}>
                                                                <span className={`text-[8px] font-bold leading-none text-black`}>
                                                                    {def.name.substr(0,2)}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Footer */}
                                <div className="mt-auto pt-2 border-t border-gray-100 text-center">
                                    <span className="text-[10px] text-gray-400 italic">Thank you!</span>
                                </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* --- Canvas --- */}
        {gameState.stacks.map(stack => (
            <CardStackComponent 
                key={stack.id} 
                stack={{
                    ...stack,
                    x: stack.x + pan.x, // Apply Camera Offset
                    y: stack.y + pan.y  // Apply Camera Offset
                }}
                onPointerDown={handleCardPointerDown} 
            />
        ))}

        {/* --- Notification --- */}
        {gameState.notification && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900/90 backdrop-blur text-white px-6 py-4 md:px-10 md:py-6 rounded-2xl font-black text-lg md:text-xl shadow-2xl z-[100] pointer-events-none border-4 border-white/20 text-center w-max max-w-[90vw]">
                {gameState.notification}
            </div>
        )}

        {/* --- Bottom Dashboard / Kitchen Counter --- */}
        <div 
            className="absolute bottom-0 left-0 w-full h-24 md:h-28 bg-white border-t-4 border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex items-center justify-between px-4 md:px-8 z-50"
            onPointerDown={(e) => e.stopPropagation()} // Prevent pan when touching UI
        >
            
            {/* Left Controls */}
            <div className="flex gap-2 md:gap-4 items-center">
                <button 
                    onClick={() => setIsRecipeBookOpen(true)}
                    className="flex flex-col items-center gap-1 text-slate-600 hover:text-blue-600 hover:scale-105 transition-all active:scale-95 group"
                >
                    <div className="bg-blue-100 p-2 md:p-3 rounded-2xl border-2 border-blue-200 group-hover:bg-blue-200 group-hover:border-blue-300 transition-colors">
                        <BookOpen size={20} className="md:w-7 md:h-7 text-blue-600" />
                    </div>
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider hidden md:block">Recipes</span>
                </button>

                <button 
                    onClick={() => setIsToolShopOpen(true)}
                    className="flex flex-col items-center gap-1 text-slate-600 hover:text-purple-600 hover:scale-105 transition-all active:scale-95 group"
                >
                    <div className="bg-purple-100 p-2 md:p-3 rounded-2xl border-2 border-purple-200 group-hover:bg-purple-200 group-hover:border-purple-300 transition-colors">
                        <Hammer size={20} className="md:w-7 md:h-7 text-purple-600" />
                    </div>
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider hidden md:block">Tools</span>
                </button>
            </div>

            {/* Center Main Action - Two Pack Buttons */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-10 md:-top-12 flex gap-3 md:gap-4">
                
                {/* Plant Pack */}
                <button 
                    onClick={() => buyPack(CardCategory.PLANT)}
                    className="bg-gradient-to-b from-green-500 to-green-600 text-white w-16 h-16 md:w-20 md:h-20 rounded-full shadow-[0_8px_0_rgb(21,128,61),0_20px_20px_rgba(0,0,0,0.3)] border-4 border-white flex flex-col items-center justify-center gap-0 active:translate-y-2 active:shadow-none hover:brightness-110 transition-all group"
                >
                    <Leaf size={20} className="md:w-6 md:h-6 group-hover:rotate-12 transition-transform" />
                    <span className="font-black text-[10px] md:text-xs uppercase mt-0.5">Plant</span>
                    <div className="bg-black/20 px-1.5 py-0.5 rounded-full text-[8px] font-bold mt-0.5">
                        {CARD_PACK_COST}g
                    </div>
                </button>

                {/* Animal Pack */}
                <button 
                    onClick={() => buyPack(CardCategory.ANIMAL)}
                    className="bg-gradient-to-b from-orange-500 to-orange-600 text-white w-16 h-16 md:w-20 md:h-20 rounded-full shadow-[0_8px_0_rgb(194,65,12),0_20px_20px_rgba(0,0,0,0.3)] border-4 border-white flex flex-col items-center justify-center gap-0 active:translate-y-2 active:shadow-none hover:brightness-110 transition-all group"
                >
                    <Drumstick size={20} className="md:w-6 md:h-6 group-hover:rotate-12 transition-transform" />
                    <span className="font-black text-[10px] md:text-xs uppercase mt-0.5">Farm</span>
                    <div className="bg-black/20 px-1.5 py-0.5 rounded-full text-[8px] font-bold mt-0.5">
                        {CARD_PACK_COST}g
                    </div>
                </button>

            </div>

            {/* Right: Sell Bin */}
            <div 
                ref={sellBinRef}
                className="w-32 md:w-48 h-16 md:h-20 border-2 border-dashed border-red-300 bg-red-50 rounded-xl flex items-center justify-center gap-2 md:gap-3 text-red-400 hover:bg-red-100 hover:border-red-400 hover:text-red-500 transition-colors group"
            >
                <div className="bg-red-200 p-1.5 md:p-2 rounded-full">
                    <Trash2 size={20} className="md:w-6 md:h-6 text-red-500" />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-xs md:text-sm uppercase tracking-wider">Sell Bin</span>
                    <span className="text-[10px] md:text-xs opacity-70 hidden md:inline">Drag ingredients here</span>
                </div>
            </div>
        </div>

        {/* --- Recipe Modal --- */}
        {isRecipeBookOpen && (
            <div 
                className="absolute inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
                onPointerDown={(e) => e.stopPropagation()}
            >
                <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-bounce-in border-4 border-slate-800">
                    <div className="bg-blue-500 p-4 md:p-6 flex justify-between items-center text-white border-b-4 border-slate-800">
                        <div className="flex items-center gap-3">
                            <ChefHat size={28} className="md:w-8 md:h-8" />
                            <h2 className="text-2xl md:text-3xl font-black">Cookbook</h2>
                        </div>
                        <button onClick={() => setIsRecipeBookOpen(false)} className="bg-black/20 hover:bg-black/40 p-2 rounded-xl transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                    
                    <div className="p-4 md:p-6 overflow-y-auto flex-1 bg-blue-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {RECIPES.map(recipe => {
                                const isUnlocked = gameState.level >= recipe.requiredLevel;
                                return (
                                    <div key={recipe.id} className={`border-2 rounded-xl p-4 shadow-sm relative overflow-hidden ${isUnlocked ? 'border-slate-800 bg-white' : 'border-gray-300 bg-gray-100'}`}>
                                        {!isUnlocked && (
                                            <div className="absolute inset-0 bg-gray-200/50 flex items-center justify-center z-10 backdrop-blur-[1px]">
                                                <div className="bg-slate-800 text-gray px-4 py-2 rounded-lg font-bold shadow-lg transform -rotate-3">
                                                    Unlocks Lvl {recipe.requiredLevel}
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-bold text-lg md:text-xl text-slate-800">{recipe.name}</h3>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] md:text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-md mb-1">+{recipe.reward} Coins</span>
                                                <span className="text-[10px] md:text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-md">+{recipe.xp} XP</span>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-gray-50 rounded-lg p-2 flex flex-wrap gap-2 items-center min-h-[48px]">
                                            {recipe.ingredients.map((ingId, idx) => {
                                                const def = CARDS[ingId];
                                                return (
                                                    <div key={idx} className="flex items-center">
                                                        <div className={`px-2 py-1 rounded-md text-[10px] md:text-xs font-bold text-black shadow-sm ${def.color} border border-black/10`}>
                                                            {def.name}
                                                        </div>
                                                        {idx < recipe.ingredients.length - 1 && <ArrowRight size={12} className="text-gray-400 mx-1" />}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* --- Tool Shop Modal --- */}
        {isToolShopOpen && (
            <div 
                className="absolute inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
                onPointerDown={(e) => e.stopPropagation()}
            >
                <div className="bg-white rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-bounce-in border-4 border-slate-800">
                    <div className="bg-purple-500 p-4 md:p-6 flex justify-between items-center text-white border-b-4 border-slate-800">
                        <div className="flex items-center gap-3">
                            <Hammer size={28} className="md:w-8 md:h-8" />
                            <h2 className="text-2xl md:text-3xl font-black">Tool Shop</h2>
                        </div>
                        <button onClick={() => setIsToolShopOpen(false)} className="bg-black/20 hover:bg-black/40 p-2 rounded-xl transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                    
                    <div className="p-4 md:p-6 overflow-y-auto flex-1 bg-purple-50">
                        <div className="grid grid-cols-1 gap-4">
                            {Object.entries(TOOL_PRICES).map(([toolId, price]) => {
                                const tool = CARDS[toolId];
                                const requiredLvl = TOOL_UNLOCK_LEVELS[toolId] || 1;
                                const isUnlocked = gameState.level >= requiredLvl;
                                const canAfford = gameState.money >= price;

                                return (
                                    <div key={toolId} className={`relative bg-white p-4 rounded-2xl border-2 flex items-center justify-between shadow-md ${isUnlocked ? 'border-slate-800' : 'border-gray-300 opacity-80'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl ${tool.color} flex items-center justify-center shadow-inner border-2 border-black/10`}>
                                                <span className="text-white font-black text-xl md:text-2xl drop-shadow-md">{tool.name[0]}</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg md:text-xl text-slate-800">{tool.name}</h3>
                                                <div className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">
                                                    {isUnlocked ? 'Available' : `Unlocks at Lvl ${requiredLvl}`}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {isUnlocked ? (
                                            <button 
                                                onClick={() => buyTool(toolId)}
                                                disabled={!canAfford}
                                                className={`px-4 py-2 md:px-6 md:py-3 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 border-b-4 ${canAfford ? 'bg-green-500 border-green-700 text-white hover:bg-green-600' : 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'}`}
                                            >
                                                <span className="text-sm md:text-base">Buy</span>
                                                <div className="bg-black/20 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                                                    <Coins size={12} /> {price}
                                                </div>
                                            </button>
                                        ) : (
                                            <div className="px-4 py-2 bg-gray-200 rounded-lg text-gray-500 font-bold text-xs md:text-sm">
                                                Locked
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}