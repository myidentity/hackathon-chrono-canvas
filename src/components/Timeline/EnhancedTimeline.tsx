/**
 * Enhanced Timeline component for ChronoCanvas
 * 
 * This component extends the basic Timeline with additional features
 * such as keyframe management, advanced marker controls, and visual enhancements.
 * It provides a more sophisticated interface for timeline manipulation.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTimeline, TimelineMarker } from '../../context/TimelineContext';
import { useCanvas } from '../../context/CanvasContext';

interface EnhancedTimelineProps {
  mode?: 'editor' | 'timeline' | 'zine' | 'presentation';
}

/**
 * EnhancedTimeline component
 * Provides advanced timeline controls with keyframe management and visual enhancements
 * 
 * @param {EnhancedTimelineProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
const EnhancedTimeline: React.FC<EnhancedTimelineProps> = ({ mode = 'timeline' }) => {
  // Get timeline and canvas context
  const { 
    currentPosition, 
    isPlaying, 
    playbackSpeed, 
    duration, 
    markers,
    togglePlayback,
    setPosition,
    setPlaybackSpeed,
    addMarker,
    removeMarker,
    setCurrentPosition,
    play,
    pause,
    seekToMarker
  } = useTimeline();
  
  const { canvas, selectedElement, updateElement } = useCanvas();
  
  // State for timeline interaction
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: duration });
  const [showMarkerForm, setShowMarkerForm] = useState(false);
  const [markerForm, setMarkerForm] = useState({ name: '', color: '#3b82f6' });
  
  // Refs for DOM elements
  const timelineRef = useRef<HTMLDivElement>(null);
  const scrubberRef = useRef<HTMLDivElement>(null);
  const keyframeButtonRef = useRef<HTMLButtonElement>(null);
  
  // Debug state to track selection
  const [lastSelectedElement, setLastSelectedElement] = useState<string | null>(null);
  
  // Update lastSelectedElement when selectedElement changes
  useEffect(() => {
    console.log('EnhancedTimeline: selectedElement changed to:', selectedElement);
    setLastSelectedElement(selectedElement);
  }, [selectedElement]);
  
  /**
   * Format time as MM:SS.ms
   * 
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time string
   */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };
  
  /**
   * Handle timeline click for seeking
   * 
   * @param {React.MouseEvent<HTMLDivElement>} e - Mouse event
   */
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    
    const timeline = e.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = clickPosition / rect.width;
    const visibleDuration = visibleRange.end - visibleRange.start;
    const newPosition = visibleRange.start + percentage * visibleDuration;
    
    setPosition(newPosition);
  };
  
  /**
   * Handle mouse down on scrubber
   * 
   * @param {React.MouseEvent} e - Mouse event
   */
  const handleScrubberMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    
    // Add event listeners for dragging
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  /**
   * Handle mouse move during scrubber drag
   * 
   * @param {MouseEvent} e - Mouse event
   */
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !timelineRef.current) return;
    
    const timeline = timelineRef.current;
    const rect = timeline.getBoundingClientRect();
    const mousePosition = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, mousePosition / rect.width));
    const visibleDuration = visibleRange.end - visibleRange.start;
    const newPosition = visibleRange.start + percentage * visibleDuration;
    
    setPosition(newPosition);
  };
  
  /**
   * Handle mouse up to end scrubber drag
   */
  const handleMouseUp = () => {
    setIsDragging(false);
    
    // Remove event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  
  /**
   * Add a marker at the current position
   */
  const handleAddMarker = () => {
    if (markerForm.name.trim()) {
      const newMarker: TimelineMarker = {
        id: `marker-${Date.now()}`,
        position: currentPosition,
        name: markerForm.name.trim(),
        color: markerForm.color
      };
      
      addMarker(newMarker);
      setMarkerForm({ name: '', color: '#3b82f6' });
      setShowMarkerForm(false);
    }
  };
  
  /**
   * Add a keyframe for the selected element at the current position
   */
  const handleAddKeyframe = useCallback(() => {
    console.log('Add Keyframe button clicked');
    console.log('Selected element:', selectedElement);
    console.log('Last selected element:', lastSelectedElement);
    
    // Use either the current selectedElement or the last known selected element
    const elementId = selectedElement || lastSelectedElement;
    
    if (!elementId) {
      console.log('No element selected, cannot add keyframe');
      alert('Please select an element first to add a keyframe');
      return;
    }
    
    // Find the selected element
    const element = canvas.elements.find(el => el.id === elementId);
    if (!element) {
      console.log('Selected element not found in canvas elements');
      alert('Selected element not found in canvas');
      return;
    }
    
    console.log('Found element for keyframe:', element);
    
    // Get current properties for the keyframe
    const keyframeProperties = {
      position: { ...element.position },
      size: { ...element.size },
      rotation: element.rotation || 0,
      opacity: element.opacity !== undefined ? element.opacity : 1,
    };
    
    console.log('Keyframe properties:', keyframeProperties);
    
    // Create or update timeline data with the new keyframe
    const timelineData = element.timelineData || {
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
      console.log('Updating existing keyframe at index:', existingKeyframeIndex);
      timelineData.keyframes[existingKeyframeIndex] = {
        time: currentPosition,
        properties: keyframeProperties,
      };
    } else {
      // Add new keyframe
      console.log('Adding new keyframe');
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
    
    console.log('Updated timeline data:', timelineData);
    
    // Update the element
    updateElement(elementId, { timelineData });
    
    // Add a marker for this keyframe
    const marker: TimelineMarker = {
      id: `keyframe-${elementId}-${Date.now()}`,
      position: currentPosition,
      name: `${element.type} Keyframe`,
      color: '#F26D5B' // Using coral accent color as requested
    };
    
    console.log('Adding keyframe marker:', marker);
    addMarker(marker);
    
    // Visual feedback
    if (keyframeButtonRef.current) {
      keyframeButtonRef.current.classList.add('animate-pulse');
      setTimeout(() => {
        if (keyframeButtonRef.current) {
          keyframeButtonRef.current.classList.remove('animate-pulse');
        }
      }, 500);
    }
  }, [selectedElement, lastSelectedElement, canvas.elements, currentPosition, updateElement, addMarker]);
  
  /**
   * Zoom the timeline in or out
   * 
   * @param {number} factor - Zoom factor
   */
  const handleZoom = (factor: number) => {
    const newZoom = Math.max(0.5, Math.min(10, zoom * factor));
    setZoom(newZoom);
    
    // Adjust visible range based on zoom
    const visibleDuration = duration / newZoom;
    const center = (visibleRange.start + visibleRange.end) / 2;
    const halfDuration = visibleDuration / 2;
    
    setVisibleRange({
      start: Math.max(0, center - halfDuration),
      end: Math.min(duration, center + halfDuration),
    });
  };
  
  /**
   * Pan the timeline left or right
   * 
   * @param {number} direction - Direction to pan (-1 for left, 1 for right)
   */
  const handlePan = (direction: number) => {
    const visibleDuration = visibleRange.end - visibleRange.start;
    const panAmount = visibleDuration * 0.2 * direction;
    
    let newStart = visibleRange.start + panAmount;
    let newEnd = visibleRange.end + panAmount;
    
    // Ensure we don't go out of bounds
    if (newStart < 0) {
      newStart = 0;
      newEnd = visibleDuration;
    } else if (newEnd > duration) {
      newEnd = duration;
      newStart = Math.max(0, newEnd - visibleDuration);
    }
    
    setVisibleRange({ start: newStart, end: newEnd });
  };
  
  /**
   * Step the timeline position by a small increment
   * 
   * @param {number} direction - Direction to step (-1 for backward, 1 for forward)
   */
  const handleStep = (direction: number) => {
    const stepSize = 0.5; // Half-second step
    const newPosition = Math.max(0, Math.min(duration, currentPosition + (stepSize * direction)));
    setPosition(newPosition);
  };
  
  /**
   * Center and fit all elements in the timeline view
   */
  const handleCenterAndFit = () => {
    // Reset zoom to default
    setZoom(1);
    
    // Find the earliest and latest points of interest
    let earliestPoint = 0;
    let latestPoint = duration;
    
    // Check markers
    if (markers.length > 0) {
      const markerTimes = markers.map(marker => marker.position);
      earliestPoint = Math.min(earliestPoint, ...markerTimes);
      latestPoint = Math.max(latestPoint, ...markerTimes);
    }
    
    // Check elements with timeline data
    canvas.elements.forEach(element => {
      if (element.timelineData) {
        if (element.timelineData.entryPoint !== undefined && element.timelineData.entryPoint !== null) {
          earliestPoint = Math.min(earliestPoint, element.timelineData.entryPoint);
        }
        
        if (element.timelineData.exitPoint !== undefined && element.timelineData.exitPoint !== null) {
          latestPoint = Math.max(latestPoint, element.timelineData.exitPoint);
        }
        
        // Check keyframes
        if (element.timelineData.keyframes && element.timelineData.keyframes.length > 0) {
          const keyframeTimes = element.timelineData.keyframes.map(kf => kf.time);
          earliestPoint = Math.min(earliestPoint, ...keyframeTimes);
          latestPoint = Math.max(latestPoint, ...keyframeTimes);
        }
      }
    });
    
    // Add some padding
    const padding = (latestPoint - earliestPoint) * 0.1;
    earliestPoint = Math.max(0, earliestPoint - padding);
    latestPoint = Math.min(duration, latestPoint + padding);
    
    // If there are no elements or markers, show the full timeline
    if (earliestPoint === 0 && latestPoint === duration) {
      setVisibleRange({ start: 0, end: duration });
    } else {
      // Set the visible range to include all points of interest
      setVisibleRange({ start: earliestPoint, end: latestPoint });
    }
  };
  
  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);
  
  // Update visible range when duration changes
  useEffect(() => {
    const visibleDuration = duration / zoom;
    setVisibleRange({
      start: 0,
      end: Math.min(duration, visibleDuration),
    });
  }, [duration, zoom]);
  
  // Add direct DOM event listener to keyframe button
  useEffect(() => {
    const keyframeBtn = keyframeButtonRef.current;
    if (keyframeBtn) {
      const clickHandler = () => {
        console.log('Keyframe button clicked via direct DOM event');
        handleAddKeyframe();
      };
      
      keyframeBtn.addEventListener('click', clickHandler);
      
      return () => {
        keyframeBtn.removeEventListener('click', clickHandler);
      };
    }
  }, [handleAddKeyframe]);
  
  // Force selectedElement to be non-null for testing purposes
  // This ensures the keyframe button is always enabled
  const hasSelectedElement = Boolean(selectedElement || lastSelectedElement);
  
  return (
    <div className="timeline-panel w-full bg-gray-800 border-t border-gray-700 p-4 text-white">
      {/* Timeline header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          {/* Current time display */}
          <div className="text-lg font-mono">
            {formatTime(currentPosition)}
          </div>
          
          {/* Playback controls */}
          <div className="flex items-center space-x-2">
            <button 
              className="bg-indigo-600 hover:bg-indigo-700 rounded-full w-10 h-10 flex items-center justify-center"
              onClick={togglePlayback}
              aria-label={isPlaying ? "Pause" : "Play"}
              data-testid="playback-toggle"
            >
              {isPlaying ? (
                <i className="material-icons">pause</i>
              ) : (
                <i className="material-icons">play_arrow</i>
              )}
            </button>
            
            <button 
              className="bg-gray-700 hover:bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center"
              onClick={() => setPosition(0)}
              aria-label="Go to start"
            >
              <i className="material-icons">first_page</i>
            </button>
            
            {/* Step backward button */}
            <button 
              className="bg-gray-700 hover:bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center"
              onClick={() => handleStep(-1)}
              aria-label="Step backward"
            >
              <i className="material-icons">skip_previous</i>
            </button>
            
            {/* Step forward button */}
            <button 
              className="bg-gray-700 hover:bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center"
              onClick={() => handleStep(1)}
              aria-label="Step forward"
            >
              <i className="material-icons">skip_next</i>
            </button>
            
            <button 
              className="bg-gray-700 hover:bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center"
              onClick={() => setPosition(duration)}
              aria-label="Go to end"
            >
              <i className="material-icons">last_page</i>
            </button>
          </div>
          
          {/* Playback speed */}
          <select 
            className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
            data-testid="playback-speed"
          >
            <option value="0.25">0.25x</option>
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
            <option value="4">4x</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Zoom controls */}
          <button 
            className="bg-gray-700 hover:bg-gray-600 rounded px-3 py-1 text-sm flex items-center justify-center"
            onClick={() => handleZoom(1.2)}
            aria-label="Zoom in"
          >
            <i className="material-icons">zoom_in</i>
          </button>
          
          <button 
            className="bg-gray-700 hover:bg-gray-600 rounded px-3 py-1 text-sm flex items-center justify-center"
            onClick={() => handleZoom(0.8)}
            aria-label="Zoom out"
          >
            <i className="material-icons">zoom_out</i>
          </button>
          
          {/* Center and fit button */}
          <button 
            className="bg-gray-700 hover:bg-gray-600 rounded px-3 py-1 text-sm flex items-center justify-center"
            onClick={handleCenterAndFit}
            aria-label="Center and fit all elements"
            title="Center and fit all elements"
          >
            <i className="material-icons">center_focus_strong</i>
          </button>
          
          {/* Pan controls */}
          <button 
            className="bg-gray-700 hover:bg-gray-600 rounded px-3 py-1 text-sm flex items-center justify-center"
            onClick={() => handlePan(-1)}
            aria-label="Pan left"
          >
            <i className="material-icons">chevron_left</i>
          </button>
          
          <button 
            className="bg-gray-700 hover:bg-gray-600 rounded px-3 py-1 text-sm flex items-center justify-center"
            onClick={() => handlePan(1)}
            aria-label="Pan right"
          >
            <i className="material-icons">chevron_right</i>
          </button>
        </div>
      </div>
      
      {/* Timeline track */}
      <div 
        ref={timelineRef}
        className="timeline-container w-full h-12 bg-gray-700 rounded-lg relative mb-4 cursor-pointer"
        onClick={handleTimelineClick}
        data-testid="timeline-track"
      >
        {/* Time markers */}
        {Array.from({ length: Math.ceil((visibleRange.end - visibleRange.start) / 5) + 1 }).map((_, i) => {
          const time = visibleRange.start + i * 5;
          const position = ((time - visibleRange.start) / (visibleRange.end - visibleRange.start)) * 100;
          
          if (time <= visibleRange.end) {
            return (
              <div 
                key={`time-${i}`}
                className="absolute top-0 h-full w-px bg-gray-600"
                style={{ left: `${position}%` }}
              >
                <div className="absolute -top-5 left-0 transform -translate-x-1/2 text-xs text-gray-400">
                  {formatTime(time)}
                </div>
              </div>
            );
          }
          return null;
        })}
        
        {/* Timeline progress */}
        <div 
          className="h-full bg-indigo-900 rounded-lg opacity-50"
          style={{ 
            width: `${((currentPosition - visibleRange.start) / (visibleRange.end - visibleRange.start)) * 100}%`,
            maxWidth: '100%'
          }}
        />
        
        {/* Current position indicator (scrubber) */}
        <div 
          ref={scrubberRef}
          className="absolute top-0 w-4 h-12 bg-indigo-500 rounded-full -ml-2 cursor-grab"
          style={{ 
            left: `${((currentPosition - visibleRange.start) / (visibleRange.end - visibleRange.start)) * 100}%`,
            zIndex: 10
          }}
          onMouseDown={handleScrubberMouseDown}
          data-testid="timeline-scrubber"
        />
        
        {/* Markers */}
        {markers.map(marker => {
          // Calculate position percentage
          const position = ((marker.position - visibleRange.start) / (visibleRange.end - visibleRange.start)) * 100;
          
          // Only render markers in the visible range
          if (position >= 0 && position <= 100) {
            // Check if this is a keyframe marker (by ID prefix)
            const isKeyframe = marker.id.startsWith('keyframe-');
            
            return (
              <div 
                key={marker.id}
                className={`absolute top-0 ${isKeyframe ? 'w-4 h-4 -ml-2 -mt-2 rotate-45 transform' : 'w-2 h-12 -ml-1'} cursor-pointer`}
                style={{ 
                  left: `${position}%`,
                  backgroundColor: marker.color || '#3b82f6',
                  top: isKeyframe ? '6px' : '0'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  seekToMarker(marker.id);
                }}
                title={marker.name}
                data-testid={`marker-${marker.id}`}
              >
                <div className="absolute -bottom-5 left-0 transform -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
                  {marker.name}
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
      
      <div className="flex items-center space-x-4 mt-4">
        {/* Add marker button */}
        <button 
          className="bg-indigo-600 hover:bg-indigo-700 rounded px-3 py-1 text-sm flex items-center"
          onClick={() => setShowMarkerForm(true)}
          data-testid="add-marker-button"
        >
          <i className="material-icons mr-1">bookmark_add</i>
          Add Marker
        </button>
        
        {/* Add keyframe button - conditionally enabled based on selection */}
        <button 
          ref={keyframeButtonRef}
          className={`${hasSelectedElement ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 cursor-not-allowed'} rounded px-3 py-1 text-sm flex items-center transition-all duration-300`}
          onClick={handleAddKeyframe}
          disabled={!hasSelectedElement}
          data-testid="add-keyframe-button"
        >
          <i className="material-icons mr-1">add_circle</i>
          Add Keyframe
          {selectedElement && <span className="ml-1 text-xs">({selectedElement.substring(0, 8)}...)</span>}
        </button>
        
        {/* Duration control */}
        <div className="flex items-center space-x-2">
          <span className="text-sm">Duration:</span>
          <input 
            type="number"
            className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-16"
            value={duration}
            onChange={(e) => {
              const newDuration = Math.max(1, parseInt(e.target.value) || 1);
              // Update duration in timeline context
              // This would require adding a setDuration function to the context
              // For now, we'll just log it
              console.log(`Setting duration to ${newDuration}`);
            }}
            min="1"
            step="1"
          />
          <span className="text-sm">sec</span>
        </div>
      </div>
      
      {/* Marker form modal */}
      {showMarkerForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md">
            <h3 className="text-lg font-medium mb-4 text-white">Add Marker</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Marker Name
              </label>
              <input 
                type="text"
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                value={markerForm.name}
                onChange={(e) => setMarkerForm({ ...markerForm, name: e.target.value })}
                placeholder="Enter marker name"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Marker Color
              </label>
              <input 
                type="color"
                className="w-full h-10 bg-gray-700 border border-gray-600 rounded px-1 py-1"
                value={markerForm.color}
                onChange={(e) => setMarkerForm({ ...markerForm, color: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                className="bg-gray-700 hover:bg-gray-600 rounded px-4 py-2 text-sm"
                onClick={() => setShowMarkerForm(false)}
              >
                Cancel
              </button>
              <button 
                className="bg-indigo-600 hover:bg-indigo-700 rounded px-4 py-2 text-sm"
                onClick={handleAddMarker}
              >
                Add Marker
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Debug info */}
      <div className="mt-4 text-xs text-gray-400">
        Selected Element: {selectedElement || 'None'} | 
        Last Selected: {lastSelectedElement || 'None'} |
        Elements: {canvas.elements.length}
      </div>
    </div>
  );
};

export default EnhancedTimeline;
