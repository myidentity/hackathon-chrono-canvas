/**
 * PropertyPanel component for ChronoCanvas
 * 
 * This component provides a panel for editing properties of the selected element,
 * including position, size, appearance, and timeline data.
 */

import React, { useState, useEffect } from 'react';
import { useCanvas, CanvasElement } from '../../context/CanvasContext';
import { useTimeline, TimelineMarker } from '../../context/TimelineContext';
import ColorPicker from '../UI/ColorPicker';

interface PropertyPanelProps {
  mode?: 'editor' | 'timeline' | 'zine' | 'presentation';
}

/**
 * PropertyPanel component
 * Provides controls for editing the selected element's properties
 * 
 * @param {PropertyPanelProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
const PropertyPanel: React.FC<PropertyPanelProps> = ({ mode = 'editor' }) => {
  // Get canvas and timeline context
  const { canvas, selectedElement, updateElement, removeElement } = useCanvas();
  const { currentPosition, addMarker } = useTimeline();
  
  // State for property editing
  const [elementProperties, setElementProperties] = useState<Partial<CanvasElement> | null>(null);
  
  // Get the selected element
  const selectedElementData = selectedElement 
    ? canvas.elements.find(element => element.id === selectedElement) 
    : null;
  
  // Update local state when selected element changes
  useEffect(() => {
    if (selectedElementData) {
      setElementProperties({ ...selectedElementData });
    } else {
      setElementProperties(null);
    }
  }, [selectedElementData]);
  
  // Handle property change
  const handlePropertyChange = (property: string, value: any) => {
    if (!elementProperties) return;
    
    // Create updated properties object
    const updatedProperties = { ...elementProperties };
    
    // Handle nested properties
    if (property.includes('.')) {
      const [parent, child] = property.split('.');
      updatedProperties[parent] = {
        ...updatedProperties[parent],
        [child]: value,
      };
    } else {
      updatedProperties[property] = value;
    }
    
    // Update local state
    setElementProperties(updatedProperties);
    
    // Update element in canvas context
    if (selectedElement) {
      updateElement(selectedElement, { [property]: value });
    }
  };
  
  // Handle timeline data change
  const handleTimelineDataChange = (property: string, value: any) => {
    if (!elementProperties || !selectedElement) return;
    
    // Create updated timeline data
    const timelineData = {
      ...(elementProperties.timelineData || {}),
      [property]: value,
    };
    
    // Update local state
    setElementProperties({
      ...elementProperties,
      timelineData,
    });
    
    // Update element in canvas context
    updateElement(selectedElement, { timelineData });
  };
  
  // Handle adding a keyframe
  const handleAddKeyframe = () => {
    if (!elementProperties || !selectedElement) return;
    
    // Get current properties for the keyframe
    const keyframeProperties = {
      position: { ...elementProperties.position },
      size: { ...elementProperties.size },
      rotation: elementProperties.rotation || 0,
      opacity: elementProperties.opacity !== undefined ? elementProperties.opacity : 1,
    };
    
    // Create or update timeline data with the new keyframe
    const timelineData = elementProperties.timelineData || {
      entryPoint: currentPosition,
      exitPoint: currentPosition + 30,
      persist: true,
      keyframes: [],
    };
    
    // Check if a keyframe already exists at this time
    const existingKeyframeIndex = timelineData.keyframes?.findIndex(
      kf => Math.abs(kf.time - currentPosition) < 0.1
    );
    
    if (existingKeyframeIndex !== undefined && existingKeyframeIndex >= 0 && timelineData.keyframes) {
      // Update existing keyframe
      timelineData.keyframes[existingKeyframeIndex] = {
        time: currentPosition,
        properties: keyframeProperties,
      };
    } else {
      // Add new keyframe
      timelineData.keyframes = [
        ...(timelineData.keyframes || []),
        {
          time: currentPosition,
          properties: keyframeProperties,
        },
      ];
    }
    
    // Sort keyframes by time
    timelineData.keyframes.sort((a, b) => a.time - b.time);
    
    // Update local state
    setElementProperties({
      ...elementProperties,
      timelineData,
    });
    
    // Update element in canvas context
    updateElement(selectedElement, { timelineData });
    
    // Add a marker for this keyframe
    const newMarker: TimelineMarker = {
      id: `keyframe-${selectedElement}-${Date.now()}`,
      position: currentPosition,
      name: `${elementProperties.type} Keyframe`,
      color: '#3b82f6'
    };
    
    addMarker(newMarker);
  };
  
  // If no element is selected, show empty state
  if (!elementProperties || !selectedElementData) {
    return (
      <div className="w-64 bg-gray-100 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 h-full overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">Properties</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">No element selected</p>
      </div>
    );
  }
  
  return (
    <div className="w-64 bg-gray-100 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">Properties</h2>
      
      {/* Element ID */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Element ID
        </label>
        <input 
          type="text"
          className="w-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:text-gray-200"
          value={elementProperties.id}
          disabled
        />
      </div>
      
      {/* Element Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Type
        </label>
        <input 
          type="text"
          className="w-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:text-gray-200"
          value={elementProperties.type}
          disabled
        />
      </div>
      
      {/* Position */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Position
        </label>
        <div className="flex space-x-2">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">X</label>
            <input 
              type="number"
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
              value={elementProperties.position?.x || 0}
              onChange={(e) => handlePropertyChange('position.x', parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Y</label>
            <input 
              type="number"
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
              value={elementProperties.position?.y || 0}
              onChange={(e) => handlePropertyChange('position.y', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>
      
      {/* Size */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Size
        </label>
        <div className="flex space-x-2">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Width</label>
            <input 
              type="number"
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
              value={elementProperties.size?.width || 0}
              onChange={(e) => handlePropertyChange('size.width', parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Height</label>
            <input 
              type="number"
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
              value={elementProperties.size?.height || 0}
              onChange={(e) => handlePropertyChange('size.height', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>
      
      {/* Rotation */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Rotation (degrees)
        </label>
        <input 
          type="number"
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
          value={elementProperties.rotation || 0}
          onChange={(e) => handlePropertyChange('rotation', parseInt(e.target.value) || 0)}
        />
      </div>
      
      {/* Opacity */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Opacity
        </label>
        <input 
          type="range"
          className="w-full accent-blue-600 dark:accent-blue-400"
          min="0"
          max="1"
          step="0.01"
          value={elementProperties.opacity !== undefined ? elementProperties.opacity : 1}
          onChange={(e) => handlePropertyChange('opacity', parseFloat(e.target.value))}
        />
        <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
          {((elementProperties.opacity !== undefined ? elementProperties.opacity : 1) * 100).toFixed(0)}%
        </div>
      </div>
      
      {/* Z-Index */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Z-Index
        </label>
        <input 
          type="number"
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
          value={elementProperties.zIndex || 0}
          onChange={(e) => handlePropertyChange('zIndex', parseInt(e.target.value) || 0)}
        />
      </div>
      
      {/* Type-specific properties */}
      {elementProperties.type === 'image' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Image Source
          </label>
          <input 
            type="text"
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
            value={elementProperties.src || ''}
            onChange={(e) => handlePropertyChange('src', e.target.value)}
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 mb-1">
            Alt Text
          </label>
          <input 
            type="text"
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
            value={elementProperties.alt || ''}
            onChange={(e) => handlePropertyChange('alt', e.target.value)}
          />
        </div>
      )}
      
      {elementProperties.type === 'text' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Text Content
          </label>
          <textarea 
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
            value={elementProperties.content || ''}
            onChange={(e) => handlePropertyChange('content', e.target.value)}
            rows={3}
          />
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Font Size</label>
              <input 
                type="text"
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
                value={elementProperties.fontSize || '16px'}
                onChange={(e) => handlePropertyChange('fontSize', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Font Weight</label>
              <select 
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
                value={elementProperties.fontWeight || 'normal'}
                onChange={(e) => handlePropertyChange('fontWeight', e.target.value)}
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="lighter">Lighter</option>
                <option value="bolder">Bolder</option>
              </select>
            </div>
            <div>
              <ColorPicker
                color={elementProperties.color || '#000000'}
                onChange={(color) => handlePropertyChange('color', color)}
                label="Color"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Text Align</label>
              <select 
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
                value={elementProperties.textAlign || 'left'}
                onChange={(e) => handlePropertyChange('textAlign', e.target.value)}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      {elementProperties.type === 'shape' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Shape Type
          </label>
          <select 
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
            value={elementProperties.shape || 'rectangle'}
            onChange={(e) => handlePropertyChange('shape', e.target.value)}
          >
            <option value="rectangle">Rectangle</option>
            <option value="circle">Circle</option>
            <option value="triangle">Triangle</option>
            <option value="star">Star</option>
            <option value="hexagon">Hexagon</option>
            <option value="pentagon">Pentagon</option>
            <option value="diamond">Diamond</option>
            <option value="arrow">Arrow</option>
          </select>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <ColorPicker
                color={elementProperties.backgroundColor || '#6366F1'}
                onChange={(color) => handlePropertyChange('backgroundColor', color)}
                label="Background Color"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Border Radius</label>
              <input 
                type="text"
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
                value={elementProperties.borderRadius || '0'}
                onChange={(e) => handlePropertyChange('borderRadius', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
      
      {elementProperties.type === 'sticker' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sticker
          </label>
          <div className="text-center p-4 bg-gray-200 dark:bg-gray-700 rounded mb-2">
            <span className="text-4xl">{elementProperties.emoji || '🌟'}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Sticker Type</label>
              <input 
                type="text"
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
                value={elementProperties.stickerType || 'emoji'}
                disabled
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Name</label>
              <input 
                type="text"
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
                value={elementProperties.name || ''}
                onChange={(e) => handlePropertyChange('name', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Timeline data */}
      <div className="mb-4">
        <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Timeline</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Entry Point (s)</label>
            <input 
              type="number"
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
              value={elementProperties.timelineData?.entryPoint || 0}
              onChange={(e) => handleTimelineDataChange('entryPoint', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Exit Point (s)</label>
            <input 
              type="number"
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
              value={elementProperties.timelineData?.exitPoint !== null ? elementProperties.timelineData?.exitPoint : ''}
              placeholder="None"
              onChange={(e) => {
                const value = e.target.value === '' ? null : parseFloat(e.target.value);
                handleTimelineDataChange('exitPoint', value);
              }}
            />
          </div>
        </div>
        <div className="mt-2">
          <label className="flex items-center">
            <input 
              type="checkbox"
              className="mr-2 accent-blue-600 dark:accent-blue-400"
              checked={elementProperties.timelineData?.persist || false}
              onChange={(e) => handleTimelineDataChange('persist', e.target.checked)}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Persist after exit</span>
          </label>
        </div>
        <div className="mt-4">
          <button
            onClick={handleAddKeyframe}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center justify-center"
          >
            <span className="material-icons text-sm mr-1">add</span>
            Add Keyframe at {currentPosition}s
          </button>
        </div>
        
        {/* Keyframes list */}
        {elementProperties.timelineData?.keyframes && elementProperties.timelineData.keyframes.length > 0 && (
          <div className="mt-4">
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Keyframes</label>
            <div className="border border-gray-300 dark:border-gray-600 rounded overflow-hidden">
              {elementProperties.timelineData.keyframes.map((keyframe, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 border-b border-gray-300 dark:border-gray-600 last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="text-sm dark:text-gray-200">{keyframe.time}s</div>
                  <div className="flex items-center">
                    <button
                      onClick={() => {
                        const updatedKeyframes = [...elementProperties.timelineData!.keyframes!];
                        updatedKeyframes.splice(index, 1);
                        handleTimelineDataChange('keyframes', updatedKeyframes);
                      }}
                      className="text-red-500 hover:text-red-600"
                      title="Remove keyframe"
                    >
                      <span className="material-icons text-sm">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Delete button */}
      <div className="mt-6">
        <button
          onClick={() => removeElement(elementProperties.id)}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center"
        >
          <span className="material-icons text-sm mr-1">delete</span>
          Delete Element
        </button>
      </div>
    </div>
  );
};

export default PropertyPanel;
