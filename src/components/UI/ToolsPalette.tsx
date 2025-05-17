/**
 * ToolsPalette component for ChronoCanvas
 * 
 * This component provides a palette of shapes, polygons, and symbols
 * that users can select and add to the canvas.
 */

import React from 'react';
import { useCanvas } from '../../context/CanvasContext';
import { v4 as uuidv4 } from 'uuid';

interface ToolsPaletteProps {
  className?: string;
}

/**
 * ToolsPalette component
 * Provides a selection of shapes, polygons, and symbols for the editor
 */
const ToolsPalette: React.FC<ToolsPaletteProps> = ({ className = '' }) => {
  const { addElement } = useCanvas();
  
  // Define shape categories
  const shapeCategories = [
    {
      name: 'Basic Shapes',
      items: [
        { id: 'rectangle', name: 'Rectangle', icon: '⬛', color: '#4ECDC4' },
        { id: 'square', name: 'Square', icon: '🟥', color: '#FF6B6B' },
        { id: 'circle', name: 'Circle', icon: '⚫', color: '#FFD166' },
        { id: 'oval', name: 'Oval', icon: '🔵', color: '#6B5CA5' },
        { id: 'triangle', name: 'Triangle', icon: '▲', color: '#72B01D' },
        { id: 'diamond', name: 'Diamond', icon: '◆', color: '#3A86FF' }
      ]
    },
    {
      name: 'Polygons',
      items: [
        { id: 'pentagon', name: 'Pentagon', icon: '⬠', color: '#FF9F1C' },
        { id: 'hexagon', name: 'Hexagon', icon: '⬡', color: '#F72585' },
        { id: 'heptagon', name: 'Heptagon', icon: '⬢', color: '#7209B7' },
        { id: 'octagon', name: 'Octagon', icon: '⯃', color: '#4CC9F0' },
        { id: 'nonagon', name: 'Nonagon', icon: '⬤', color: '#2EC4B6' },
        { id: 'decagon', name: 'Decagon', icon: '⭓', color: '#E71D36' },
        { id: 'star', name: 'Star', icon: '★', color: '#FF9F1C' },
        { id: 'star4', name: '4-Point Star', icon: '✦', color: '#8338EC' },
        { id: 'star5', name: '5-Point Star', icon: '✭', color: '#06D6A0' },
        { id: 'star6', name: '6-Point Star', icon: '✯', color: '#FF6B6B' },
        { id: 'star8', name: '8-Point Star', icon: '✴', color: '#4ECDC4' },
        { id: 'rhombus', name: 'Rhombus', icon: '◊', color: '#FFD166' }
      ]
    },
    {
      name: 'Arrows',
      items: [
        { id: 'arrow_right', name: 'Right Arrow', icon: '➡', color: '#6B5CA5' },
        { id: 'arrow_left', name: 'Left Arrow', icon: '⬅', color: '#72B01D' },
        { id: 'arrow_up', name: 'Up Arrow', icon: '⬆', color: '#3A86FF' },
        { id: 'arrow_down', name: 'Down Arrow', icon: '⬇', color: '#FF9F1C' },
        { id: 'arrow_up_right', name: 'Up-Right Arrow', icon: '↗', color: '#F72585' },
        { id: 'arrow_up_left', name: 'Up-Left Arrow', icon: '↖', color: '#7209B7' },
        { id: 'arrow_down_right', name: 'Down-Right Arrow', icon: '↘', color: '#4CC9F0' },
        { id: 'arrow_down_left', name: 'Down-Left Arrow', icon: '↙', color: '#2EC4B6' },
        { id: 'double_arrow', name: 'Double Arrow', icon: '⇄', color: '#E71D36' },
        { id: 'curved_arrow', name: 'Curved Arrow', icon: '↪', color: '#FF9F1C' },
        { id: 'circular_arrow', name: 'Circular Arrow', icon: '↻', color: '#8338EC' },
        { id: 'arrow_triangle', name: 'Triangle Arrow', icon: '▶', color: '#06D6A0' }
      ]
    },
    {
      name: 'Math Symbols',
      items: [
        { id: 'plus', name: 'Plus', icon: '➕', color: '#FF6B6B' },
        { id: 'minus', name: 'Minus', icon: '➖', color: '#4ECDC4' },
        { id: 'multiply', name: 'Multiply', icon: '✖', color: '#FFD166' },
        { id: 'divide', name: 'Divide', icon: '➗', color: '#6B5CA5' },
        { id: 'equals', name: 'Equals', icon: '=', color: '#72B01D' },
        { id: 'not_equals', name: 'Not Equals', icon: '≠', color: '#3A86FF' },
        { id: 'greater_than', name: 'Greater Than', icon: '>', color: '#FF9F1C' },
        { id: 'less_than', name: 'Less Than', icon: '<', color: '#F72585' },
        { id: 'infinity', name: 'Infinity', icon: '∞', color: '#7209B7' },
        { id: 'sum', name: 'Sum', icon: '∑', color: '#4CC9F0' },
        { id: 'integral', name: 'Integral', icon: '∫', color: '#2EC4B6' },
        { id: 'square_root', name: 'Square Root', icon: '√', color: '#E71D36' }
      ]
    },
    {
      name: 'Common Symbols',
      items: [
        { id: 'heart', name: 'Heart', icon: '❤', color: '#E71D36' },
        { id: 'check', name: 'Check', icon: '✓', color: '#06D6A0' },
        { id: 'cross', name: 'Cross', icon: '✗', color: '#E71D36' },
        { id: 'music', name: 'Music', icon: '♪', color: '#7209B7' },
        { id: 'lightning', name: 'Lightning', icon: '⚡', color: '#FFD166' },
        { id: 'cloud', name: 'Cloud', icon: '☁', color: '#4ECDC4' },
        { id: 'sun', name: 'Sun', icon: '☀', color: '#FF9F1C' },
        { id: 'moon', name: 'Moon', icon: '☽', color: '#6B5CA5' },
        { id: 'star_symbol', name: 'Star Symbol', icon: '⋆', color: '#F72585' },
        { id: 'snowflake', name: 'Snowflake', icon: '❄', color: '#4CC9F0' },
        { id: 'flower', name: 'Flower', icon: '✿', color: '#FF6B6B' },
        { id: 'leaf', name: 'Leaf', icon: '🍃', color: '#72B01D' }
      ]
    },
    {
      name: 'UI Elements',
      items: [
        { id: 'checkbox', name: 'Checkbox', icon: '☐', color: '#3A86FF' },
        { id: 'checkbox_checked', name: 'Checked Box', icon: '☑', color: '#06D6A0' },
        { id: 'radio', name: 'Radio Button', icon: '○', color: '#7209B7' },
        { id: 'radio_selected', name: 'Selected Radio', icon: '◉', color: '#F72585' },
        { id: 'toggle_off', name: 'Toggle Off', icon: '⊝', color: '#6B5CA5' },
        { id: 'toggle_on', name: 'Toggle On', icon: '⦿', color: '#06D6A0' },
        { id: 'menu', name: 'Menu', icon: '≡', color: '#2EC4B6' },
        { id: 'search', name: 'Search', icon: '🔍', color: '#4CC9F0' },
        { id: 'settings', name: 'Settings', icon: '⚙', color: '#8338EC' },
        { id: 'home', name: 'Home', icon: '⌂', color: '#FF9F1C' },
        { id: 'user', name: 'User', icon: '👤', color: '#4ECDC4' },
        { id: 'lock', name: 'Lock', icon: '🔒', color: '#E71D36' }
      ]
    },
    {
      name: 'Special Shapes',
      items: [
        { id: 'speech_bubble', name: 'Speech Bubble', icon: '💬', color: '#FFD166' },
        { id: 'thought_bubble', name: 'Thought Bubble', icon: '💭', color: '#4ECDC4' },
        { id: 'puzzle', name: 'Puzzle Piece', icon: '🧩', color: '#FF6B6B' },
        { id: 'target', name: 'Target', icon: '◎', color: '#E71D36' },
        { id: 'shield', name: 'Shield', icon: '🛡', color: '#3A86FF' },
        { id: 'crown', name: 'Crown', icon: '👑', color: '#FF9F1C' },
        { id: 'flag', name: 'Flag', icon: '⚑', color: '#F72585' },
        { id: 'bell', name: 'Bell', icon: '🔔', color: '#FFD166' },
        { id: 'tag', name: 'Tag', icon: '🏷', color: '#7209B7' },
        { id: 'bookmark', name: 'Bookmark', icon: '🔖', color: '#4CC9F0' },
        { id: 'calendar', name: 'Calendar', icon: '📅', color: '#2EC4B6' },
        { id: 'clock', name: 'Clock', icon: '🕒', color: '#8338EC' }
      ]
    },
    {
      name: 'Geometric Symbols',
      items: [
        { id: 'cube', name: 'Cube', icon: '▣', color: '#06D6A0' },
        { id: 'cylinder', name: 'Cylinder', icon: '⌭', color: '#FF6B6B' },
        { id: 'sphere', name: 'Sphere', icon: '●', color: '#4ECDC4' },
        { id: 'cone', name: 'Cone', icon: '△', color: '#FFD166' },
        { id: 'pyramid', name: 'Pyramid', icon: '◮', color: '#6B5CA5' },
        { id: 'torus', name: 'Torus', icon: '◎', color: '#72B01D' },
        { id: 'prism', name: 'Prism', icon: '⧊', color: '#3A86FF' },
        { id: 'tetrahedron', name: 'Tetrahedron', icon: '◭', color: '#FF9F1C' },
        { id: 'octahedron', name: 'Octahedron', icon: '◇', color: '#F72585' },
        { id: 'dodecahedron', name: 'Dodecahedron', icon: '⬟', color: '#7209B7' },
        { id: 'icosahedron', name: 'Icosahedron', icon: '◈', color: '#4CC9F0' },
        { id: 'helix', name: 'Helix', icon: '⌇', color: '#2EC4B6' }
      ]
    }
  ];
  
  // Handle adding a shape to the canvas
  const handleAddShape = (shapeType: string, color: string) => {
    // Create a new shape element
    const newElement = {
      id: `${shapeType}-${uuidv4().substring(0, 8)}`,
      type: 'shape',
      shape: shapeType,
      position: {
        x: 100,
        y: 100,
      },
      size: {
        width: 100,
        height: 100,
      },
      rotation: 0,
      backgroundColor: color,
      opacity: 1,
      zIndex: 1,
      timelineData: {
        entryPoint: 0,
        exitPoint: null,
        persist: true,
        keyframes: [
          {
            time: 0,
            properties: {
              opacity: 0,
              scale: 0.8,
            },
          },
          {
            time: 1,
            properties: {
              opacity: 1,
              scale: 1,
            },
          },
        ],
      },
    };
    
    // Add the new element to the canvas
    if (addElement) {
      addElement(newElement);
    }
  };
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 ${className}`}>
      <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">Tools Palette</h3>
      
      {shapeCategories.map((category) => (
        <div key={category.name} className="mb-4">
          <h4 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">{category.name}</h4>
          <div className="grid grid-cols-4 gap-2">
            {category.items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleAddShape(item.id, item.color)}
                className="flex flex-col items-center justify-center p-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title={`Add ${item.name}`}
              >
                <span className="text-2xl mb-1" style={{ color: item.color }}>{item.icon}</span>
                <span className="text-xs text-gray-600 dark:text-gray-300 truncate w-full text-center">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToolsPalette;
