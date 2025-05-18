/**
 * PropertyPanel component for ChronoCanvas
 * 
 * This component provides a panel for editing properties of the selected element,
 * including position, size, appearance, and timeline data.
 */

import React, { useState, useEffect, useRef } from 'react';
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
  
  // Refs to prevent dependency cycles
  const markersRef = useRef<TimelineMarker[]>([]);
  const selectedElementRef = useRef<string | null>(null);
  
  // Update refs when state changes
  useEffect(() => {
    markersRef.current = markers;
  }, [markers]);
  
  useEffect(() => {
    selectedElementRef.current = selectedElement;
  }, [selectedElement]);
  
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
    
    // Check if a marker with this ID already exists
    const currentMarkers = markersRef.current;
    const existingMarker = currentMarkers.find(m => m.id === markerId);
    
    if (existingMarker) {
      // If it exists, remove it first to avoid duplicates
      removeMarker(markerId);
    }
    
    // Add a marker for this keyframe with the stable ID
    const newMarker: TimelineMarker = {
      id: markerId,
      position: currentPosition,
      name: `${elementProperties.type || 'Element'} Keyframe`,
      color: '#F26D5B'
    };
    
    // Add the marker
    addMarker(newMarker);
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
    
    // Remove the marker using the stable ID
    removeMarker(markerId);
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
          <div className="grid grid-cols-1 gap-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Source
              </label>
              <input 
                type="text"
                className="w-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:text-gray-200"
                value={elementProperties.src || ''}
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Alt Text
              </label>
              <input 
                type="text"
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
                value={elementProperties.alt || ''}
                onChange={(e) => handlePropertyChange('alt', e.target.value)}
                placeholder="Describe the image"
              />
            </div>
          </div>
        </div>
      )}
      
      {elementProperties.type === 'text' && (
        <div className="mb-4">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
            Text Properties
          </h3>
          <div className="grid grid-cols-1 gap-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content
              </label>
              <textarea 
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
                value={elementProperties.content || ''}
                onChange={(e) => handlePropertyChange('content', e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Font Size
              </label>
              <input 
                type="number"
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-sm dark:text-gray-200"
                value={elementProperties.fontSize || 16}
                onChange={(e) => handlePropertyChange('fontSize', parseInt(e.target.value) || 16)}
              />
            </div>
            <div>
              <ColorPicker
                color={elementProperties.color || '#000000'}
                onChange={(color) => handlePropertyChange('color', color)}
                label="Text Color"
              />
            </div>
          </div>
        </div>
      )}
      
      {elementProperties.type === 'sticker' && (
        <div className="mb-4">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sticker Properties
          </h3>
          <div className="grid grid-cols-1 gap-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sticker Type
              </label>
              <input 
                type="text"
                className="w-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:text-gray-200"
                value={elementProperties.stickerType || ''}
                disabled
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Keyframe Controls */}
      <div className="mb-4 mt-8 border-t border-gray-200 dark:border-gray-700 pt-4">
        <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
          Animation Keyframes
        </h3>
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 text-sm font-medium transition-colors"
          onClick={handleAddKeyframe}
        >
          Add Keyframe at Current Position
        </button>
        
        {/* Keyframe List */}
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Existing Keyframes
          </h4>
          {elementProperties.timelineData?.keyframes && elementProperties.timelineData.keyframes.length > 0 ? (
            <div className="space-y-2">
              {elementProperties.timelineData.keyframes.map((keyframe, index) => (
                <div 
                  key={`keyframe-${index}`}
                  className="flex justify-between items-center bg-white dark:bg-gray-700 rounded p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => handleKeyframeClick(keyframe.time)}
                >
                  <div className="flex items-center">
                    <span className="material-icons text-red-500 mr-2" style={{ fontSize: '16px' }}>
                      diamond
                    </span>
                    <span className="text-sm dark:text-gray-200">
                      {keyframe.time.toFixed(1)}s
                    </span>
                  </div>
                  <button
                    className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                    onClick={(e) => handleDeleteKeyframe(e, index)}
                    title="Delete keyframe"
                    aria-label="Delete keyframe"
                  >
                    <span className="material-icons" style={{ fontSize: '16px' }}>close</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No keyframes added yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyPanel;
