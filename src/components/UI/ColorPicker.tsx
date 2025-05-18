/**
 * ColorPicker component for ChronoCanvas
 * 
 * This component provides an enhanced color picker with preset colors,
 * custom color input, and theme-aware styling.
 */

import React, { useState, useEffect } from 'react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

/**
 * ColorPicker component
 * Provides an enhanced color picker with preset colors and custom input
 */
const ColorPicker: React.FC<ColorPickerProps> = ({ 
  color, 
  onChange,
  label = 'Color'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(color);
  
  // Update internal state when external color changes
  useEffect(() => {
    setCurrentColor(color);
  }, [color]);
  
  // Preset colors for quick selection
  const presetColors = [
    // Primary colors
    '#FF0000', '#00FF00', '#0000FF',
    // Secondary colors
    '#FFFF00', '#FF00FF', '#00FFFF',
    // Neutrals
    '#000000', '#FFFFFF', '#808080',
    // Material Design colors
    '#F44336', '#2196F3', '#4CAF50',
    '#FFEB3B', '#9C27B0', '#FF9800'
  ];
  
  // Handle color change
  const handleColorChange = (newColor: string) => {
    setCurrentColor(newColor);
    onChange(newColor);
  };
  
  // Toggle color picker dropdown
  const togglePicker = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="relative">
      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
        {label}
      </label>
      
      <div className="flex items-center space-x-2">
        {/* Color preview and selector */}
        <div 
          className="w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
          style={{ backgroundColor: currentColor }}
          onClick={togglePicker}
        />
        
        {/* Color input field */}
        <input 
          type="text"
          className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
          value={currentColor}
          onChange={(e) => handleColorChange(e.target.value)}
        />
        
        {/* Native color input (hidden but functional) */}
        <input 
          type="color"
          className="w-0 h-0 opacity-0 absolute"
          value={currentColor}
          onChange={(e) => handleColorChange(e.target.value)}
          id="native-color-picker"
        />
        
        {/* Color picker button */}
        <label 
          htmlFor="native-color-picker"
          className="p-2 bg-gray-200 dark:bg-gray-600 rounded cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
        >
          <span className="material-icons text-gray-700 dark:text-gray-200" style={{ fontSize: '16px' }}>
            colorize
          </span>
        </label>
      </div>
      
      {/* Color presets dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-1 p-2 bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-200 dark:border-gray-700 grid grid-cols-6 gap-1 w-full">
          {presetColors.map((presetColor, index) => (
            <div
              key={index}
              className="w-6 h-6 rounded-full cursor-pointer border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
              style={{ backgroundColor: presetColor }}
              onClick={() => {
                handleColorChange(presetColor);
                setIsOpen(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
