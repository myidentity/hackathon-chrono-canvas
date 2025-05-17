/**
 * PropertyPanel component for ChronoCanvas
 * 
 * This component provides an interface for editing properties of selected elements.
 */

import React, { useState, useEffect } from 'react';
import { useCanvas } from '../../context/CanvasContext';
import { useTimeline } from '../../context/TimelineContext';
import { motion } from 'framer-motion';

// Type definitions
interface PropertyPanelProps {
  viewMode: 'editor' | 'timeline' | 'zine' | 'presentation';
}

interface ElementProperty {
  name: string;
  type: 'text' | 'number' | 'color' | 'select' | 'image' | 'boolean';
  label: string;
  options?: string[];
}

/**
 * PropertyPanel component for editing element properties
 */
const PropertyPanel: React.FC<PropertyPanelProps> = ({ viewMode }) => {
  const { canvas, selectedElements, updateElement } = useCanvas();
  const { currentPosition, addMarker } = useTimeline();
  
  // State for the currently selected element
  const [selectedElement, setSelectedElement] = useState<any>(null);
  
  // Update selected element when selection changes
  useEffect(() => {
    if (selectedElements.length === 1) {
      const element = canvas.elements.find(el => el.id === selectedElements[0]);
      setSelectedElement(element);
    } else {
      setSelectedElement(null);
    }
  }, [selectedElements, canvas.elements]);
  
  // Handle property change
  const handlePropertyChange = (property: string, value: any) => {
    if (selectedElement) {
      updateElement(selectedElement.id, { [property]: value });
    }
  };
  
  // Handle text property change
  const handleTextPropertyChange = (property: string, value: any) => {
    if (selectedElement && selectedElement.properties) {
      updateElement(selectedElement.id, {
        properties: {
          ...selectedElement.properties,
          [property]: value,
        },
      });
    }
  };
  
  // Handle position change
  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: number) => {
    if (selectedElement) {
      updateElement(selectedElement.id, {
        position: {
          ...selectedElement.position,
          [axis]: value,
        },
      });
    }
  };
  
  // Handle size change
  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    if (selectedElement) {
      updateElement(selectedElement.id, {
        size: {
          ...selectedElement.size,
          [dimension]: value,
        },
      });
    }
  };
  
  // Handle timeline data change
  const handleTimelineDataChange = (property: string, value: any) => {
    if (selectedElement) {
      updateElement(selectedElement.id, {
        timelineData: {
          ...selectedElement.timelineData,
          [property]: value,
        },
      });
    }
  };
  
  // Handle adding a keyframe
  const handleAddKeyframe = () => {
    if (selectedElement) {
      const newKeyframe = {
        id: `keyframe-${Date.now()}`,
        time: currentPosition,
        properties: {
          position: { ...selectedElement.position },
          size: { ...selectedElement.size },
          rotation: selectedElement.rotation,
          opacity: selectedElement.opacity,
        },
      };
      
      updateElement(selectedElement.id, {
        timelineData: {
          ...selectedElement.timelineData,
          keyframes: [...(selectedElement.timelineData.keyframes || []), newKeyframe],
        },
      });
      
      // Add a marker for this keyframe
      addMarker(`${selectedElement.type} Keyframe`, currentPosition, '#3b82f6');
    }
  };
  
  // Get element properties based on type
  const getElementProperties = (type: string): ElementProperty[] => {
    switch (type) {
      case 'text':
        return [
          { name: 'text', type: 'text', label: 'Text Content' },
          { name: 'fontFamily', type: 'select', label: 'Font Family', options: ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Georgia'] },
          { name: 'fontSize', type: 'number', label: 'Font Size' },
          { name: 'fontWeight', type: 'select', label: 'Font Weight', options: ['normal', 'bold', 'lighter', 'bolder'] },
          { name: 'color', type: 'color', label: 'Text Color' },
          { name: 'textAlign', type: 'select', label: 'Text Align', options: ['left', 'center', 'right', 'justify'] },
        ];
      case 'image':
        return [
          { name: 'src', type: 'image', label: 'Image Source' },
          { name: 'alt', type: 'text', label: 'Alt Text' },
          { name: 'objectFit', type: 'select', label: 'Object Fit', options: ['contain', 'cover', 'fill', 'none', 'scale-down'] },
        ];
      case 'shape':
        return [
          { name: 'shapeType', type: 'select', label: 'Shape Type', options: ['rectangle', 'circle', 'triangle', 'polygon'] },
          { name: 'fillColor', type: 'color', label: 'Fill Color' },
          { name: 'strokeColor', type: 'color', label: 'Stroke Color' },
          { name: 'strokeWidth', type: 'number', label: 'Stroke Width' },
        ];
      case 'sticker':
        return [
          { name: 'stickerType', type: 'select', label: 'Sticker Type', options: ['travel', 'nature', 'abstract', 'emoji'] },
          { name: 'stickerName', type: 'select', label: 'Sticker', options: ['airplane', 'camera', 'mountain', 'beach', 'heart', 'star'] },
        ];
      default:
        return [];
    }
  };
  
  // Render property inputs based on type
  const renderPropertyInput = (property: ElementProperty) => {
    if (!selectedElement || !selectedElement.properties) return null;
    
    const value = selectedElement.properties[property.name];
    
    switch (property.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleTextPropertyChange(property.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            data-testid={`${property.name}-input`}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={value || 0}
            onChange={(e) => handleTextPropertyChange(property.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
          />
        );
      case 'color':
        return (
          <div className="flex items-center">
            <input
              type="color"
              value={value || '#000000'}
              onChange={(e) => handleTextPropertyChange(property.name, e.target.value)}
              className="w-10 h-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="text"
              value={value || '#000000'}
              onChange={(e) => handleTextPropertyChange(property.name, e.target.value)}
              className="ml-2 flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        );
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleTextPropertyChange(property.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
          >
            {property.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'image':
        return (
          <div className="flex flex-col">
            <input
              type="text"
              value={value || ''}
              onChange={(e) => handleTextPropertyChange(property.name, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="Enter image URL"
            />
            <button
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => {/* Open file picker or media library */}}
            >
              Browse Images
            </button>
          </div>
        );
      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => handleTextPropertyChange(property.name, e.target.checked ? 'true' : 'false')}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
        );
      default:
        return null;
    }
  };
  
  // If no element is selected or not in editor mode
  if (!selectedElement || viewMode !== 'editor') {
    return (
      <div className="w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Properties</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {viewMode !== 'editor' 
            ? 'Properties are only available in editor mode.' 
            : 'Select an element to edit its properties.'}
        </p>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      data-testid="property-panel"
    >
      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)} Element
      </h2>
      
      {/* Common properties */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Position</h3>
        <div className="grid grid-cols-3 gap-2 mt-1">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400">X</label>
            <input
              type="number"
              value={selectedElement.position.x}
              onChange={(e) => handlePositionChange('x', Number(e.target.value))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400">Y</label>
            <input
              type="number"
              value={selectedElement.position.y}
              onChange={(e) => handlePositionChange('y', Number(e.target.value))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400">Z</label>
            <input
              type="number"
              value={selectedElement.position.z}
              onChange={(e) => handlePositionChange('z', Number(e.target.value))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Size</h3>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400">Width</label>
            <input
              type="number"
              value={selectedElement.size.width}
              onChange={(e) => handleSizeChange('width', Number(e.target.value))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400">Height</label>
            <input
              type="number"
              value={selectedElement.size.height}
              onChange={(e) => handleSizeChange('height', Number(e.target.value))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Appearance</h3>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400">Rotation</label>
            <input
              type="number"
              value={selectedElement.rotation}
              onChange={(e) => handlePropertyChange('rotation', Number(e.target.value))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400">Opacity</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={selectedElement.opacity}
              onChange={(e) => handlePropertyChange('opacity', Number(e.target.value))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
      </div>
      
      {/* Timeline properties */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Timeline</h3>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400">Entry Point</label>
            <input
              type="number"
              value={selectedElement.timelineData.entryPoint}
              onChange={(e) => handleTimelineDataChange('entryPoint', Number(e.target.value))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400">Exit Point</label>
            <input
              type="number"
              value={selectedElement.timelineData.exitPoint || ''}
              onChange={(e) => handleTimelineDataChange('exitPoint', e.target.value ? Number(e.target.value) : null)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
        <div className="mt-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedElement.timelineData.persist}
              onChange={(e) => handleTimelineDataChange('persist', e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Persist after exit</span>
          </label>
        </div>
        <div className="mt-2">
          <button
            onClick={handleAddKeyframe}
            className="w-full px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Keyframe at Current Position
          </button>
        </div>
      </div>
      
      {/* Element-specific properties */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Element Properties</h3>
        {getElementProperties(selectedElement.type).map((property) => (
          <div key={property.name} className="mt-2">
            <label className="block text-xs text-gray-500 dark:text-gray-400">{property.label}</label>
            {renderPropertyInput(property)}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PropertyPanel;
