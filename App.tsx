import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ShoppingBag, BookOpen, Star, ChefHat, Coins, User, Hammer, X, Clock, Receipt, Trash2, ArrowRight, XCircle, Leaf, Drumstick, Bookmark, ZoomIn, ZoomOut } from 'lucide-react';
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
  
  // Camera Pan & Zoom State
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  
  // UI Refs for drop zones
  const sellBinRef = useRef<HTMLDivElement>(null);

  const dragRef = useRef<{
    activeId: string | null;
    isPanning: boolean;
    offsetX: number; // Stored in World Units
    offsetY: number; // Stored in World Units
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

  // --- Zoom Controls ---
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2.0));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

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
      // Spawn relative to current view center (Screen Center -> World Center)
      // World = (Screen - Pan) / Zoom
      const worldCx = ((window.innerWidth / 2) - pan.x) / zoom;
      const worldCy = ((window.innerHeight / 2) - pan.y) / zoom;

      const spawnTool = (toolId: string, offsetX: number, offsetY: number) => {
          newStacks.push({
              id: generateId(), 
              x: worldCx + offsetX, 
              y: worldCy + offsetY, 
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
      
      // Calculate offset in World Coordinates
      // World Mouse = (Screen Mouse - Pan) / Zoom
      const worldMouseX = (e.clientX - pan.x) / zoom;
      const worldMouseY = (e.clientY - pan.y) / zoom;

      // Offset = World Mouse - Stack Position
      const offsetX = worldMouseX - draggingStack.x;
      const offsetY = worldMouseY - draggingStack.y;

      dragRef.current = {
        ...dragRef.current,
        activeId: draggingStack.id,
        offsetX, // Stored in World Units
        offsetY, // Stored in World Units
        isPanning: false
      };
      return { ...prev, stacks: newStacksList };
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // 1. Panning Logic (Moves the "Camera", operates in Screen Space)
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

    // 2. Dragging Logic (Moves the Card in World Space)
    if (dragRef.current.activeId) {
        e.preventDefault();
        const { activeId, offsetX, offsetY } = dragRef.current;
        
        // Calculate new World Position
        // World Mouse = (Screen Mouse - Pan) / Zoom
        const worldMouseX = (e.clientX - pan.x) / zoom;
        const worldMouseY = (e.clientY - pan.y) / zoom;

        // New Stack Pos = World Mouse - Initial Offset
        const newStackX = worldMouseX - offsetX;
        const newStackY = worldMouseY - offsetY;

        setGameState(prev => ({
        ...prev,
        stacks: prev.stacks.map(s => s.id === activeId ? { ...s, x: newStackX, y: newStackY } : s)
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
          
          // Project Stack Position to Screen Space
          // Screen = (World * Zoom) + Pan
          // Add some offset for center of card (approx 48x64)
          const stackScreenX = (activeStack.x * zoom) + pan.x + (48 * zoom); 
          const stackScreenY = (activeStack.y * zoom) + pan.y + (64 * zoom); 

          if (stackScreenX >= binRect.left && stackScreenX <= binRect.right &&
              stackScreenY >= binRect.top && stackScreenY <= binRect.bottom) {
              
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
        // Distance check in world space (consistent regardless of zoom)
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
    // Spawn in Center of View (World Coordinates)
    const worldCx = ((window.innerWidth / 2) - pan.x) / zoom;
    const worldCy = ((window.innerHeight / 2) - pan.y) / zoom;

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

        const rawX = worldCx + Math.cos(angle) * radius;
        const rawY = worldCy + Math.sin(angle) * radius;
        
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
    const worldCx = ((window.innerWidth / 2) - pan.x) / zoom;
    const worldCy = ((window.innerHeight / 2) - pan.y) / zoom;
    
    const newStack: CardStack = {
      id: generateId(),
      x: worldCx - 48 + (Math.random() * 40 - 20),
      y: worldCy - 64 + (Math.random() * 40 - 20),
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
        {/* Kitchen Tile Background - Moves with Pan and Scales with Zoom */}
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
                backgroundSize: `${100 * zoom}px ${100 * zoom}px`,
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
                                className="relative flex-shrink-0 bg-[#fff9c4] w-32 sm:w-40 md:w-48 p-3 shadow-xl transform transition-transform hover:scale-[1.02] origin-top border border-yellow-200 flex flex-col gap-2 rounded-sm group"
                                style={{ minHeight: '120px' }}
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
                                <div className="border-b border-yellow-300 pb-1 mb-1 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-yellow-800 uppercase tracking-wider">ORDER #{customer.id.substr(0,3)}</span>
                                </div>
                                
                                {/* Order List */}
                                <div className="flex flex-col gap-2 flex-1">
                                    {customer.orders.map((recipeId, idx) => {
                                        const recipe = RECIPES.find(r => r.id === recipeId);
                                        if (!recipe) return null;
                                        return (
                                            <div key={idx} className="flex justify-between items-center border-b border-dashed border-yellow-300 pb-1 last:border-0">
                                                <span className="text-xs md:text-sm font-black text-slate-800 leading-none whitespace-normal pr-1">{recipe.name}</span>
                                                <span className="text-[10px] md:text-xs font-bold text-green-700 whitespace-nowrap">+{recipe.reward}g</span>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Footer Text */}
                                <div className="mt-auto pt-2 border-t border-yellow-300 text-center">
                                    <span className="text-[10px] text-yellow-700 italic">Thank you!</span>
                                </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* --- Canvas (Transformed World Container) --- */}
        <div 
            className="absolute inset-0 pointer-events-none origin-top-left transition-transform duration-75"
            style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
            }}
        >
            {gameState.stacks.map(stack => (
                <CardStackComponent 
                    key={stack.id} 
                    stack={stack} // Pass World Coordinates directly
                    onPointerDown={handleCardPointerDown} 
                />
            ))}
        </div>

        {/* --- Zoom Controls --- */}
        <div className="absolute bottom-[120] right-4 flex flex-col gap-2 z-40" onPointerDown={e => e.stopPropagation()}>
            <button onClick={handleZoomIn} className="bg-white p-2 rounded-xl shadow-lg border-2 border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 transition-all">
                <ZoomIn size={24} />
            </button>
            <button onClick={handleZoomOut} className="bg-white p-2 rounded-xl shadow-lg border-2 border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 transition-all">
                <ZoomOut size={24} />
            </button>
        </div>

        {/* --- Notification --- */}
        {gameState.notification && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900/90 backdrop-blur text-white px-6 py-4 md:px-10 md:py-6 rounded-2xl font-black text-lg md:text-xl shadow-2xl z-[100] pointer-events-none border-4 border-white/20 text-center w-max max-w-[90vw]">
                {gameState.notification}
            </div>
        )}

        {/* --- Bottom Dashboard / Kitchen Counter --- */}
        <div 
            className="absolute bottom-0 left-0 w-full h-24 md:h-28 bg-white border-t-4 border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex items-center justify-between px-2 md:px-8 z-50"
            onPointerDown={(e) => e.stopPropagation()} // Prevent pan when touching UI
        >
            
            {/* Left Controls */}
            <div className="flex gap-2 items-center">
                <button 
                    onClick={() => setIsRecipeBookOpen(true)}
                    className="flex flex-col items-center gap-1 text-slate-600 hover:text-amber-800 hover:scale-105 transition-all active:scale-95 group"
                >
                    <div className="bg-amber-100 p-2 md:p-3 rounded-2xl border-2 border-amber-200 group-hover:bg-amber-200 group-hover:border-amber-400 transition-colors">
                        <BookOpen size={20} className="md:w-7 md:h-7 text-amber-800" />
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
            <div className="absolute left-1/2 -translate-x-1/2 -top-10 md:-top-12 flex gap-2 md:gap-4">
                
                {/* Plant Pack */}
                <button 
                    onClick={() => buyPack(CardCategory.PLANT)}
                    className="bg-gradient-to-b from-green-500 to-green-600 text-white w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-[0_6px_0_rgb(21,128,61),0_15px_15px_rgba(0,0,0,0.3)] md:shadow-[0_8px_0_rgb(21,128,61),0_20px_20px_rgba(0,0,0,0.3)] border-4 border-white flex flex-col items-center justify-center gap-0 active:translate-y-2 active:shadow-none hover:brightness-110 transition-all group"
                >
                    <Leaf size={18} className="md:w-6 md:h-6 group-hover:rotate-12 transition-transform" />
                    <span className="font-black text-[9px] md:text-xs uppercase mt-0.5">Plant</span>
                    <div className="bg-black/20 px-1.5 py-0 rounded-full text-[8px] font-bold mt-0.5">
                        {CARD_PACK_COST}g
                    </div>
                </button>

                {/* Animal Pack */}
                <button 
                    onClick={() => buyPack(CardCategory.ANIMAL)}
                    className="bg-gradient-to-b from-orange-500 to-orange-600 text-white w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-[0_6px_0_rgb(194,65,12),0_15px_15px_rgba(0,0,0,0.3)] md:shadow-[0_8px_0_rgb(194,65,12),0_20px_20px_rgba(0,0,0,0.3)] border-4 border-white flex flex-col items-center justify-center gap-0 active:translate-y-2 active:shadow-none hover:brightness-110 transition-all group"
                >
                    <Drumstick size={18} className="md:w-6 md:h-6 group-hover:rotate-12 transition-transform" />
                    <span className="font-black text-[9px] md:text-xs uppercase mt-0.5">Farm</span>
                    <div className="bg-black/20 px-1.5 py-0 rounded-full text-[8px] font-bold mt-0.5">
                        {CARD_PACK_COST}g
                    </div>
                </button>

            </div>

            {/* Right: Sell Bin */}
            <div 
                ref={sellBinRef}
                className="w-auto px-3 md:px-0 md:w-48 h-14 md:h-20 border-2 border-dashed border-red-300 bg-red-50 rounded-xl flex items-center justify-center gap-2 md:gap-3 text-red-400 hover:bg-red-100 hover:border-red-400 hover:text-red-500 transition-colors group"
            >
                <div className="bg-red-200 p-1.5 md:p-2 rounded-full">
                    <Trash2 size={20} className="md:w-6 md:h-6 text-red-500" />
                </div>
                <div className="flex flex-col hidden md:flex">
                    <span className="font-bold text-xs md:text-sm uppercase tracking-wider">Sell Bin</span>
                    <span className="text-[10px] md:text-xs opacity-70">Drag items here</span>
                </div>
                {/* Mobile text */}
                <span className="font-bold text-xs uppercase tracking-wider md:hidden">Sell</span>
            </div>
        </div>

        {/* --- Recipe Book (Cookbook) --- */}
        {isRecipeBookOpen && (
            <div 
                className="absolute inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
                onPointerDown={(e) => e.stopPropagation()}
            >
                {/* Leather Book Container */}
                <div className="bg-[#5D4037] rounded-r-3xl rounded-l-md w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-bounce-in border-4 border-[#3E2723] relative">
                    {/* Spine Effect */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#3E2723] to-[#5D4037] z-20 border-r border-[#3E2723]/50"></div>
                    
                    {/* Header: Embossed Leather Look */}
                    <div className="bg-[#4E342E] p-4 md:p-6 pl-12 flex justify-between items-center text-[#D7CCC8] border-b-4 border-[#3E2723] shadow-inner relative z-10">
                        <div className="flex items-center gap-3">
                            <Bookmark size={28} className="md:w-8 md:h-8 text-[#FFB74D]" />
                            <h2 className="text-2xl md:text-3xl font-serif font-black tracking-wider text-[#FFCC80] drop-shadow-md">The Cookbook</h2>
                        </div>
                        <button onClick={() => setIsRecipeBookOpen(false)} className="bg-[#3E2723]/50 hover:bg-[#3E2723] text-[#FFCC80] p-2 rounded-xl transition-colors border border-[#FFCC80]/20">
                            <X size={24} />
                        </button>
                    </div>
                    
                    {/* Pages Area (Parchment) */}
                    <div className="flex-1 bg-[#FDF6E3] relative overflow-hidden flex flex-col pl-10">
                        {/* Page Texture Overlay */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>
                        
                        <div className="p-6 md:p-8 overflow-y-auto flex-1 z-10">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {RECIPES.map(recipe => {
                                    const isUnlocked = gameState.level >= recipe.requiredLevel;
                                    return (
                                        <div key={recipe.id} className={`relative p-4 rounded-sm shadow-sm transition-all group ${isUnlocked ? 'bg-[#FFFEF7] border border-[#D7CCC8] rotate-0 hover:rotate-1' : 'bg-gray-100 border border-gray-300 opacity-70 grayscale'}`}>
                                            {/* Push Pin */}
                                            {isUnlocked && <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-red-800 shadow-sm z-20"></div>}

                                            {!isUnlocked && (
                                                <div className="absolute inset-0 bg-gray-200/40 flex items-center justify-center z-10 backdrop-blur-[1px]">
                                                    <div className="bg-[#3E2723] text-[#FFCC80] px-3 py-1 rounded font-serif font-bold shadow-lg transform -rotate-3 text-sm">
                                                        Lvl {recipe.requiredLevel}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <div className="flex justify-between items-start mb-2 border-b border-[#D7CCC8] pb-2 border-dashed">
                                                <h3 className="font-serif font-bold text-xl text-[#3E2723] leading-tight w-2/3">{recipe.name}</h3>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xs font-bold text-[#2E7D32]">+{recipe.reward}g</span>
                                                    <span className="text-[10px] font-bold text-[#1565C0]">+{recipe.xp}xp</span>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-2 flex flex-wrap gap-2 items-center">
                                                {recipe.ingredients.map((ingId, idx) => {
                                                    const def = CARDS[ingId];
                                                    return (
                                                        <div key={idx} className="flex items-center">
                                                            <div className={`px-2 py-0.5 rounded text-[10px] font-bold text-[#3E2723] border border-[#8D6E63]/30 bg-[#EFEBE9]`}>
                                                                {def.name}
                                                            </div>
                                                            {idx < recipe.ingredients.length - 1 && <span className="text-[#8D6E63] mx-1 text-xs">+</span>}
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
