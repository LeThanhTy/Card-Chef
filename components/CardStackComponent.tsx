import React from 'react';
import { CardStack, GameCard } from '../types';
import { CARDS } from '../constants';
import { 
  Utensils, Sword, CircleDot, CupSoda, Flame, Soup, Microwave, GlassWater, // Tools
  Beef, Egg, Carrot, Circle, Fish, Milk, Wheat, Slice, Sandwich, // Basic Ingredients
  Cherry, Cookie, Codesandbox, Candy, // Old Extra
  Drumstick, Snail, Waves, Eraser, // Animal New
  Leaf, CircleDashed, Grid3X3, Triangle, Hexagon, // Plant New
  HelpCircle,
  LucideIcon
} from 'lucide-react';

// Icon Map
export const ICON_MAP: Record<string, LucideIcon> = {
  'Square': Utensils, // Board generic
  'Sword': Sword, // Knife
  'CircleDot': CircleDot, // Pan
  'CupSoda': CupSoda, // Pot
  'Flame': Flame, // Stove
  'Soup': Soup, // Bowl
  'Microwave': Microwave, // Oven
  'GlassWater': GlassWater, // Blender
  
  'Beef': Beef,
  'Egg': Egg,
  'Carrot': Carrot,
  'Circle': Circle, // Rice generic, Lemon
  'Fish': Fish,
  'Milk': Milk,
  'Wheat': Wheat,
  'Slice': Slice, // Cheese
  'Sandwich': Sandwich,
  
  'Cherry': Cherry, // Tomato
  'Cookie': Cookie, // Potato
  'Codesandbox': Codesandbox, // Pasta
  'Candy': Candy, // Sugar

  // Animal New
  'Drumstick': Drumstick, // Chicken
  'Snail': Snail, // Shrimp
  'Waves': Waves, // Bacon
  'Eraser': Eraser, // Butter

  // Plant New
  'Leaf': Leaf, // Lettuce
  'CircleDashed': CircleDashed, // Onion
  'Grid3X3': Grid3X3, // Corn
  'Triangle': Triangle, // Garlic
  'Hexagon': Hexagon, // Strawberry
};

interface Props {
  stack: CardStack;
  onPointerDown: (e: React.PointerEvent, stackId: string, cardIndex: number) => void;
}

export const CardStackComponent: React.FC<Props> = ({ stack, onPointerDown }) => {
  return (
    <div
      className="absolute touch-none select-none transition-transform duration-75 pointer-events-auto"
      style={{
        left: stack.x,
        top: stack.y,
        zIndex: stack.isDragging ? 9999 : 10,
        // When dragging, we might be dragging a split stack, but this component 
        // renders whatever `stack` object is passed to it.
        cursor: stack.isDragging ? 'grabbing' : 'grab',
        transform: `${stack.isDragging ? 'scale(1.05)' : 'scale(1)'} rotate(${stack.rotation}deg)`,
      }}
    >
      {/* Render cards in the stack with slight offset */}
      {stack.cards.map((card, index) => {
        const def = CARDS[card.defId];
        const Icon = ICON_MAP[def.iconName] || HelpCircle;
        
        // Visual stacking effect
        // Compact visual offset for responsiveness
        const offsetY = index * -22; 
        const zIndex = index;

        return (
          <div
            key={card.instanceId}
            onPointerDown={(e) => onPointerDown(e, stack.id, index)}
            className={`
              absolute 
              w-20 h-28 md:w-24 md:h-32 
              rounded-xl border-2 border-gray-800 shadow-lg 
              flex flex-col items-center justify-between 
              p-1.5 md:p-2
              ${def.color} ${index === stack.cards.length - 1 ? 'brightness-110' : 'brightness-90'}
              hover:brightness-125 transition-all
            `}
            style={{
              top: offsetY,
              left: 0, // Stack vertically aligned
              zIndex: zIndex,
              transformOrigin: 'bottom center',
            }}
          >
            {/* Card Content */}
            <div className="w-full text-[9px] md:text-[10px] font-black text-center uppercase tracking-tighter opacity-80 truncate text-slate-900">
              {def.type}
            </div>
            
            <div className="bg-white p-1.5 md:p-2 rounded-full shadow-md border-2 border-slate-900/10 shrink-0">
               <Icon className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
            </div>

            <div className="w-full text-[10px] md:text-xs font-bold text-center leading-tight bg-white rounded py-0.5 md:py-1 text-black border border-slate-900/10 shadow-sm min-h-[1.5em] flex items-center justify-center whitespace-normal break-words px-0.5">
              {def.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};
