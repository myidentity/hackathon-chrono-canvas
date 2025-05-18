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
import { ViewMode } from '../../types/ViewMode';

interface KeyframeProperties {
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  rotation?: number;
  opacity?: number;
  [key: string]: any;
}

interface TimelineDataType {
  entryPoint?: number;
  exitPoint?: number;
  persist?: boolean;
  keyframes?: Array<{
    time: number;
    properties: KeyframeProperties;
  }>;
}

interface PropertyPanelProps {
  mode?: ViewMode;
}

/**
 * PropertyPanel component
 * Provides controls for editing the selected element's properties
 */
const PropertyPanel: React.FC<PropertyPanelProps> = () => {
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
    // Remove console logs for production
    // console.log('PropertyPanel: selectedElementData changed:', selectedElementData);
    if (selectedElementData) {
      // console.log('PropertyPanel: updating elementProperties with:', selectedElementData);
      setElementProperties({ ...selectedElementData });
    } else {
      // console.log('PropertyPanel: clearing elementProperties');
      setElementProperties(null);
    }
  }, [selectedElementData]);
  
  // Handle property change
  const handlePropertyChange = (property: string, value: string | number | boolean | object) => {
    if (!elementProperties) return;
    
    // Create updated properties object
    const updatedProperties = { ...elementProperties } as Partial<CanvasElement>;
    
    // Handle nested properties
    if (property.includes('.')) {
      const [parent, child] = property.split('.');
      if (parent && child) {
        if (!updatedProperties[parent]) {
          updatedProperties[parent] = {};
        }
        updatedProperties[parent] = {
          ...updatedProperties[parent],
          [child]: value,
        };
      }
    } else {
      updatedProperties[property as keyof CanvasElement] = value as any;
    }
    
    // Update local state
    setElementProperties(updatedProperties);
    
    // Update element in canvas context
    if (selectedElement) {
      const updateObj: Record<string, any> = {};
      updateObj[property] = value;
      updateElement(selectedElement, updateObj);
    }
  };
  
  // Handle timeline data change
  const handleTimelineDataChange = (property: string, value: string | number | boolean | object) => {
    if (!elementProperties || !selectedElement) return;
    
    // Create updated timeline data
    const timelineData: TimelineDataType = {
      ...(elementProperties.timelineData || {}),
      [property]: value,
    };
    
    // Update local state
    setElementProperties({
      ...elementProperties,
      timelineData,
    });
    
    // Update element in canvas context
    updateElement(selectedElement, { timelineData: timelineData as any });
  };
  
  // Handle adding a keyframe
  const handleAddKeyframe = () => {
    if (!elementProperties || !selectedElement) return;
    
    // Get current properties for the keyframe
    const keyframeProperties: {
      position?: { x: number; y: number };
      size?: { width: number; height: number };
      rotation?: number;
      opacity?: number;
    } = {
      position: elementProperties.position ? { ...elementProperties.position } : undefined,
      size: elementProperties.size ? { ...elementProperties.size } : undefined,
      rotation: elementProperties.rotation || 0,
      opacity: elementProperties.opacity !== undefined ? elementProperties.opacity : 1,
    };
    
    // Create or update timeline data with the new keyframe
    const timelineData: TimelineDataType = elementProperties.timelineData || {
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
    if (timelineData.keyframes) {
      timelineData.keyframes.sort((a, b) => a.time - b.time);
    }
    
    // Update local state
    setElementProperties({
      ...elementProperties,
      timelineData,
    });
    
    // Update element in canvas context
    updateElement(selectedElement, { timelineData: timelineData as any });
    
    // Add a marker for this keyframe
    const newMarker: TimelineMarker = {
      id: `keyframe-${selectedElement}-${Date.now()}`,
      position: currentPosition,
      name: `${elementProperties.type || 'Element'} Keyframe`,
      color: '#3b82f6'
    };
    
    addMarker(newMarker);
  };
  
  // Handle element deletion
  const handleDeleteElement = () => {
    if (selectedElement) {
      removeElement(selectedElement);
    }
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold dark:text-gray-100">Properties</h2>
        {selectedElement && (
          <button 
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            onClick={handleDeleteElement}
            title="Delete element"
            aria-label="Delete element"
          >
            <span className="material-icons">delete</span>
          </button>
        )}
      </div>
      
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
      
      {/* Timeline Data */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 border-b border-gray-300 dark:border-gray-600 pb-1">
          Timeline Data
        </h3>
        
        {/* Entry and Exit Points */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Entry (sec)</label>
            <input 
              type="number"
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
              value={elementProperties.timelineData?.entryPoint || 0}
              onChange={(e) => handleTimelineDataChange('entryPoint', parseFloat(e.target.value) || 0)}
              step="0.1"
              min="0"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Exit (sec)</label>
            <input 
              type="number"
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
              value={elementProperties.timelineData?.exitPoint || 0}
              onChange={(e) => handleTimelineDataChange('exitPoint', parseFloat(e.target.value) || 0)}
              step="0.1"
              min="0"
            />
          </div>
        </div>
        
        {/* Persist checkbox */}
        <div className="flex items-center mb-2">
          <input 
            type="checkbox"
            className="mr-2 accent-blue-600 dark:accent-blue-400"
            checked={elementProperties.timelineData?.persist || false}
            onChange={(e) => handleTimelineDataChange('persist', e.target.checked)}
            id="persist-checkbox"
          />
          <label htmlFor="persist-checkbox" className="text-xs text-gray-700 dark:text-gray-300">
            Persist after exit point
          </label>
        </div>
        
        {/* Keyframes List */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              Keyframes
            </label>
            <button 
              className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded flex items-center"
              onClick={handleAddKeyframe}
            >
              <i className="material-icons text-xs mr-1">add</i>
              Add
            </button>
          </div>
          
          {/* List of keyframes */}
          <div className="bg-gray-200 dark:bg-gray-700 rounded p-2 max-h-40 overflow-y-auto">
            {elementProperties.timelineData?.keyframes && elementProperties.timelineData.keyframes.length > 0 ? (
              <ul className="divide-y divide-gray-300 dark:divide-gray-600">
                {elementProperties.timelineData.keyframes.map((keyframe, index) => (
                  <li key={index} className="py-1 flex justify-between items-center">
                    <span className="text-xs text-gray-700 dark:text-gray-300">
                      {keyframe.time.toFixed(2)}s
                    </span>
                    <button 
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      onClick={() => {
                        // Remove this keyframe
                        if (elementProperties.timelineData?.keyframes && selectedElement) {
                          const updatedKeyframes = elementProperties.timelineData.keyframes.filter((_, i) => i !== index);
                          const updatedTimelineData = {
                            ...elementProperties.timelineData,
                            keyframes: updatedKeyframes
                          };
                          
                          // Update element in canvas context
                          updateElement(selectedElement, { timelineData: updatedTimelineData as any });
                          
                          // Update local state
                          setElementProperties({
                            ...elementProperties,
                            timelineData: updatedTimelineData
                          });
                        }
                      }}
                      title="Delete keyframe"
                    >
                      <i className="material-icons text-xs">delete</i>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
                No keyframes added yet
              </p>
            )}
          </div>
        </div>
      </div>