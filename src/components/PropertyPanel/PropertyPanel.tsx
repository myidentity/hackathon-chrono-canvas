/**
 * PropertyPanel component for ChronoCanvas.
 * 
 * This component provides a panel for editing properties of selected elements
 * on the canvas, including position, size, appearance, and timeline data.
 * 
 * @module PropertyPanel
 */

import { useState, useEffect } from 'react';
import { useCanvas } from '../../context/CanvasContext';
import { useTimeline } from '../../context/TimelineContext';

/**
 * PropertyPanel component that provides controls for editing element properties
 * 
 * @returns {JSX.Element} The rendered PropertyPanel component
 */
function PropertyPanel(): JSX.Element {
  // Get canvas and timeline context
  const { canvas, selectedElements, updateElement, removeElement } = useCanvas();
  const { duration, currentPosition } = useTimeline();
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<'style' | 'animation' | 'timeline'>('style');
  
  // Get the selected element (currently only supporting single selection)
  const selectedElement = selectedElements.length > 0
    ? canvas.elements.find(element => element.id === selectedElements[0])
    : null;
  
  /**
   * Handle position change
   * 
   * @param {string} axis - The axis to change (x, y, z)
   * @param {number} value - The new value
   */
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
  
  /**
   * Handle size change
   * 
   * @param {string} dimension - The dimension to change (width, height)
   * @param {number} value - The new value
   */
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
  
  /**
   * Handle rotation change
   * 
   * @param {number} value - The new rotation value
   */
  const handleRotationChange = (value: number) => {
    if (selectedElement) {
      updateElement(selectedElement.id, {
        rotation: value,
      });
    }
  };
  
  /**
   * Handle opacity change
   * 
   * @param {number} value - The new opacity value
   */
  const handleOpacityChange = (value: number) => {
    if (selectedElement) {
      updateElement(selectedElement.id, {
        opacity: value,
      });
    }
  };
  
  /**
   * Handle timeline entry point change
   * 
   * @param {number} value - The new entry point value
   */
  const handleEntryPointChange = (value: number) => {
    if (selectedElement) {
      updateElement(selectedElement.id, {
        timelineData: {
          ...selectedElement.timelineData,
          entryPoint: value,
        },
      });
    }
  };
  
  /**
   * Handle timeline exit point change
   * 
   * @param {number | null} value - The new exit point value
   */
  const handleExitPointChange = (value: number | null) => {
    if (selectedElement) {
      updateElement(selectedElement.id, {
        timelineData: {
          ...selectedElement.timelineData,
          exitPoint: value,
        },
      });
    }
  };
  
  /**
   * Handle persist toggle
   * 
   * @param {boolean} value - The new persist value
   */
  const handlePersistChange = (value: boolean) => {
    if (selectedElement) {
      updateElement(selectedElement.id, {
        timelineData: {
          ...selectedElement.timelineData,
          persist: value,
        },
      });
    }
  };
  
  /**
   * Handle element deletion
   */
  const handleDeleteElement = () => {
    if (selectedElement) {
      removeElement(selectedElement.id);
    }
  };
  
  // If no element is selected, show empty state
  if (!selectedElement) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 p-6 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
        <h3 className="text-lg font-medium mb-2">No Element Selected</h3>
        <p className="text-sm">Select an element on the canvas to edit its properties.</p>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Element type header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="font-medium">
            {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)} Element
          </h3>
          <p className="text-xs text-gray-500">ID: {selectedElement.id.substring(0, 8)}...</p>
        </div>
        <button
          className="text-red-500 hover:text-red-700"
          onClick={handleDeleteElement}
          title="Delete Element"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Property tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === 'style'
              ? 'text-primary-600 border-b-2 border-primary-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('style')}
        >
          Style
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === 'animation'
              ? 'text-primary-600 border-b-2 border-primary-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('animation')}
        >
          Animation
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === 'timeline'
              ? 'text-primary-600 border-b-2 border-primary-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('timeline')}
        >
          Timeline
        </button>
      </div>
      
      {/* Property content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Style tab */}
        {activeTab === 'style' && (
          <div className="space-y-4">
            {/* Position controls */}
            <div>
              <h4 className="text-sm font-medium mb-2">Position</h4>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">X</label>
                  <input
                    type="number"
                    className="input"
                    value={selectedElement.position.x}
                    onChange={(e) => handlePositionChange('x', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Y</label>
                  <input
                    type="number"
                    className="input"
                    value={selectedElement.position.y}
                    onChange={(e) => handlePositionChange('y', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Z</label>
                  <input
                    type="number"
                    className="input"
                    value={selectedElement.position.z}
                    onChange={(e) => handlePositionChange('z', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
            
            {/* Size controls */}
            <div>
              <h4 className="text-sm font-medium mb-2">Size</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Width</label>
                  <input
                    type="number"
                    className="input"
                    value={selectedElement.size.width}
                    onChange={(e) => handleSizeChange('width', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Height</label>
                  <input
                    type="number"
                    className="input"
                    value={selectedElement.size.height}
                    onChange={(e) => handleSizeChange('height', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
            
            {/* Appearance controls */}
            <div>
              <h4 className="text-sm font-medium mb-2">Appearance</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Rotation</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    className="w-full"
                    value={selectedElement.rotation}
                    onChange={(e) => handleRotationChange(Number(e.target.value))}
                  />
                  <div className="text-xs text-right">{selectedElement.rotation}°</div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Opacity</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    className="w-full"
                    value={selectedElement.opacity}
                    onChange={(e) => handleOpacityChange(Number(e.target.value))}
                  />
                  <div className="text-xs text-right">{Math.round(selectedElement.opacity * 100)}%</div>
                </div>
              </div>
            </div>
            
            {/* Element-specific properties would go here */}
          </div>
        )}
        
        {/* Animation tab */}
        {activeTab === 'animation' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Animation properties will be implemented in the next phase.</p>
          </div>
        )}
        
        {/* Timeline tab */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            {/* Timeline entry/exit controls */}
            <div>
              <h4 className="text-sm font-medium mb-2">Timeline Points</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Entry Point (seconds)</label>
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    step="0.1"
                    className="w-full"
                    value={selectedElement.timelineData.entryPoint}
                    onChange={(e) => handleEntryPointChange(Number(e.target.value))}
                  />
                  <div className="text-xs text-right">{selectedElement.timelineData.entryPoint.toFixed(1)}s</div>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Exit Point (seconds)</label>
                  <div className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedElement.timelineData.exitPoint !== null}
                      onChange={(e) => handleExitPointChange(e.target.checked ? duration : null)}
                    />
                    <span className="text-xs">Enable exit point</span>
                  </div>
                  
                  {selectedElement.timelineData.exitPoint !== null && (
                    <>
                      <input
                        type="range"
                        min={selectedElement.timelineData.entryPoint}
                        max={duration}
                        step="0.1"
                        className="w-full"
                        value={selectedElement.timelineData.exitPoint}
                        onChange={(e) => handleExitPointChange(Number(e.target.value))}
                      />
                      <div className="text-xs text-right">{selectedElement.timelineData.exitPoint.toFixed(1)}s</div>
                    </>
                  )}
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedElement.timelineData.persist}
                    onChange={(e) => handlePersistChange(e.target.checked)}
                  />
                  <span className="text-xs">Persist after timeline point</span>
                </div>
              </div>
            </div>
            
            {/* Current timeline position indicator */}
            <div className="bg-gray-100 p-3 rounded-md">
              <div className="text-xs text-gray-500 mb-1">Current Timeline Position</div>
              <div className="text-sm font-medium">{currentPosition.toFixed(1)}s</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertyPanel;
