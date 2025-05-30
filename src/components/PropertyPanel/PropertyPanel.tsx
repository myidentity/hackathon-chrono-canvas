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
  const { currentPosition, addMarker, removeMarker, setPosition, markers } = useTimeline();
  
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
  
  // Generate a stable marker ID for a keyframe
  const generateKeyframeMarkerId = (elementId: string, time: number) => {
    return `keyframe-${elementId}-${time.toFixed(1)}`;
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
    
    // Generate a stable marker ID based on element ID and time
    const markerId = generateKeyframeMarkerId(selectedElement, currentPosition);
    
    // Add a marker for this keyframe with the stable ID
    const newMarker: TimelineMarker = {
      id: markerId,
      position: currentPosition,
      name: `${elementProperties.type || 'Element'} Keyframe`,
      color: '#F26D5B'
    };
    
    // Check if a marker with this ID already exists
    const existingMarker = markers.find(m => m.id === markerId);
    if (existingMarker) {
      // If it exists, remove it first to avoid duplicates
      removeMarker(markerId);
    }
    
    // Add the marker
    addMarker(newMarker);
    
    console.log(`Added keyframe marker with ID: ${markerId} at position: ${currentPosition}`);
  };
  
  // Handle element deletion
  const handleDeleteElement = () => {
    if (selectedElement) {
      removeElement(selectedElement);
    }
  };

  // Handle keyframe click to navigate to that position
  const handleKeyframeClick = (time: number) => {
    setPosition(time);
  };
  
  // Handle keyframe deletion
  const handleDeleteKeyframe = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // Prevent triggering the click event on the parent div
    
    if (!elementProperties || !selectedElement || !elementProperties.timelineData?.keyframes) return;
    
    // Get the keyframe time before removing it (for marker removal)
    const keyframeTime = elementProperties.timelineData.keyframes[index].time;
    
    // Create a copy of the keyframes array without the deleted keyframe
    const updatedKeyframes = [...elementProperties.timelineData.keyframes];
    updatedKeyframes.splice(index, 1);
    
    // Create updated timeline data
    const timelineData: TimelineDataType = {
      ...elementProperties.timelineData,
      keyframes: updatedKeyframes,
    };
    
    // Update local state
    setElementProperties({
      ...elementProperties,
      timelineData,
    });
    
    // Update element in canvas context
    updateElement(selectedElement, { timelineData: timelineData as any });
    
    // Generate the stable marker ID for this keyframe
    const markerId = generateKeyframeMarkerId(selectedElement, keyframeTime);
    
    console.log(`Removing keyframe marker with ID: ${markerId} at position: ${keyframeTime}`);
    
    // Remove the marker using the stable ID
    removeMarker(markerId);
    
    // Log the current markers after removal for debugging
    console.log('Current markers after removal:', markers);
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
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-100 dark:bg-gray-800 z-10 pb-2">
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
      {elementProperties.type === 'shape' && (
        <div className="mb-4">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
            Shape Properties
          </h3>
          <div className="grid grid-cols-1 gap-4 mt-2">
            <div>
              <ColorPicker
                color={elementProperties.color || '#333333'}
                onChange={(color) => handlePropertyChange('color', color)}
                label="Stroke Color"
              />
            </div>
            <div>
              <ColorPicker
                color={elementProperties.backgroundColor || 'transparent'}
                onChange={(color) => handlePropertyChange('backgroundColor', color)}
                label="Fill Color"
              />
            </div>
          </div>
        </div>
      )}
      
      {elementProperties.type === 'image' && (
        <div className="mb-4">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
            Image Properties
          </h3>
          
          {/* Image Source */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Image Source
            </label>
            <input 
              type="text"
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
              value={elementProperties.src || ''}
              onChange={(e) => handlePropertyChange('src', e.target.value)}
            />
          </div>
          
          {/* Alt Text */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Alt Text
            </label>
            <input 
              type="text"
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
              value={elementProperties.alt || ''}
              onChange={(e) => handlePropertyChange('alt', e.target.value)}
            />
          </div>
        </div>
      )}
      
      {elementProperties.type === 'text' && (
        <div className="mb-4">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
            Text Properties
          </h3>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Text Content
          </label>
          <textarea 
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
            value={elementProperties.content || ''}
            onChange={(e) => handlePropertyChange('content', e.target.value)}
            rows={3}
          />
          
          {/* Font Properties */}
          <div className="mt-3 mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Font</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Font Family</label>
                <select 
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
                  value={elementProperties.fontFamily || 'Arial, sans-serif'}
                  onChange={(e) => handlePropertyChange('fontFamily', e.target.value)}
                >
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="'Times New Roman', serif">Times New Roman</option>
                  <option value="'Courier New', monospace">Courier New</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="Verdana, sans-serif">Verdana</option>
                  <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                  <option value="Impact, sans-serif">Impact</option>
                  <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
                </select>
              </div>
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
            </div>
          </div>
          
          {/* Text Layout */}
          <div className="mt-3 mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Layout</label>
            <div className="grid grid-cols-2 gap-2">
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
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Text Decoration</label>
                <select 
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
                  value={elementProperties.textDecoration || 'none'}
                  onChange={(e) => handlePropertyChange('textDecoration', e.target.value)}
                >
                  <option value="none">None</option>
                  <option value="underline">Underline</option>
                  <option value="line-through">Strikethrough</option>
                  <option value="overline">Overline</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Timeline Data */}
      <div className="mb-4">
        <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
          Timeline
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Entry Point</label>
            <input 
              type="number"
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
              value={elementProperties.timelineData?.entryPoint || 0}
              onChange={(e) => handleTimelineDataChange('entryPoint', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Exit Point</label>
            <input 
              type="number"
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
              value={elementProperties.timelineData?.exitPoint || 30}
              onChange={(e) => handleTimelineDataChange('exitPoint', parseFloat(e.target.value) || 30)}
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex items-center"
            onClick={handleAddKeyframe}
          >
            <span className="material-icons mr-1" style={{ fontSize: '16px' }}>add_circle</span>
            Add Keyframe
          </button>
        </div>
        
        {/* Keyframe List */}
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Keyframes
          </h4>
          {(!elementProperties.timelineData?.keyframes || elementProperties.timelineData.keyframes.length === 0) ? (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              No keyframes added yet
            </p>
          ) : (
            <div className="border border-gray-300 dark:border-gray-600 rounded overflow-hidden">
              <div className="max-h-40 overflow-y-auto">
                {elementProperties.timelineData.keyframes.map((keyframe, index) => (
                  <div 
                    key={`keyframe-${index}`}
                    className={`flex justify-between items-center p-2 text-sm border-b border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer ${
                      Math.abs(keyframe.time - currentPosition) < 0.1 ? 'bg-blue-100 dark:bg-blue-900' : ''
                    }`}
                    onClick={() => handleKeyframeClick(keyframe.time)}
                  >
                    <div className="flex items-center">
                      <span className="material-icons text-blue-500 mr-2" style={{ fontSize: '16px' }}>
                        diamond
                      </span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {keyframe.time.toFixed(1)}s
                      </span>
                    </div>
                    <button
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      onClick={(e) => handleDeleteKeyframe(e, index)}
                      title="Delete keyframe"
                      aria-label="Delete keyframe"
                    >
                      <span className="material-icons" style={{ fontSize: '16px' }}>delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyPanel;
