/**
 * Enhanced Timeline component for ChronoCanvas
 * 
 * This component extends the basic Timeline with additional features
 * such as keyframe management, advanced marker controls, and visual enhancements.
 * It provides a more sophisticated interface for timeline manipulation.
 */

import React, { useState, useEffect, useRef } from 'react';
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
  const handleAddKeyframe = () => {
    if (!selectedElement) return;
    
    // Find the selected element
    const element = canvas.elements.find(el => el.id === selectedElement);
    if (!element) return;
    
    // Get current properties for the keyframe
    const keyframeProperties = {
      position: { ...element.position },
      size: { ...element.size },
      rotation: element.rotation || 0,
      opacity: element.opacity !== undefined ? element.opacity : 1,
    };
    
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
    
    // Update the element
    updateElement(selectedElement, { timelineData });
    
    // Add a marker for this keyframe
    const marker: TimelineMarker = {
      id: `keyframe-${selectedElement}-${Date.now()}`,
      position: currentPosition,
      name: `${element.type} Keyframe`,
      color: '#3b82f6'
    };
    
    addMarker(marker);
  };
  
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
  
  return (
    <div className="w-full bg-gray-800 border-t border-gray-700 p-4 text-white">
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
                <span className="material-icons">pause</span>
              ) : (
                <span className="material-icons">play_arrow</span>
              )}
            </button>
            
            <button 
              className="bg-gray-700 hover:bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center"
              onClick={() => setPosition(0)}
              aria-label="Go to start"
            >
              <span className="material-icons">first_page</span>
            </button>
            
            <button 
              className="bg-gray-700 hover:bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center"
              onClick={() => setPosition(duration)}
              aria-label="Go to end"
            >
              <span className="material-icons">last_page</span>
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
            <span className="material-icons">zoom_in</span>
          </button>
          
          <button 
            className="bg-gray-700 hover:bg-gray-600 rounded px-3 py-1 text-sm flex items-center justify-center"
            onClick={() => handleZoom(0.8)}
            aria-label="Zoom out"
          >
            <span className="material-icons">zoom_out</span>
          </button>
          
          {/* Pan controls */}
          <button 
            className="bg-gray-700 hover:bg-gray-600 rounded px-3 py-1 text-sm flex items-center justify-center"
            onClick={() => handlePan(-1)}
            aria-label="Pan left"
          >
            <span className="material-icons">chevron_left</span>
          </button>
          
          <button 
            className="bg-gray-700 hover:bg-gray-600 rounded px-3 py-1 text-sm flex items-center justify-center"
            onClick={() => handlePan(1)}
            aria-label="Pan right"
          >
            <span className="material-icons">chevron_right</span>
          </button>
        </div>
      </div>
      
      {/* Timeline track */}
      <div 
        ref={timelineRef}
        className="w-full h-12 bg-gray-700 rounded-lg relative mb-4 cursor-pointer"
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
            return (
              <div 
                key={marker.id}
                className="absolute top-0 w-2 h-12 -ml-1 cursor-pointer"
                style={{ 
                  left: `${position}%`,
                  backgroundColor: marker.color || '#3b82f6'
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
          <span className="material-icons mr-1">bookmark_add</span>
          Add Marker
        </button>
        
        {/* Add keyframe button (only enabled when an element is selected) */}
        <button 
          className={`${
            selectedElement 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-gray-600 cursor-not-allowed'
          } rounded px-3 py-1 text-sm flex items-center`}
          onClick={handleAddKeyframe}
          disabled={!selectedElement}
          data-testid="add-keyframe-button"
        >
          <span className="material-icons mr-1">add_circle</span>
          Add Keyframe
        </button>       
        
        {/* Duration control */}
        <div className="flex items-center space-x-2">
          <span className="text-sm">Duration:</span>
          <input 
            type="number"
            className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-20"
            value={duration}
            onChange={(e) => {
              const newDuration = Math.max(10, parseInt(e.target.value) || 60);
              // TODO: Update duration in context
            }}
            min="10"
            step="10"
            data-testid="duration-input"
          />
          <span className="text-sm">seconds</span>
        </div>
        
        {/* Debug info */}
        <div className="ml-auto text-xs text-gray-400">
          Zoom: {zoom.toFixed(1)}x | Range: {formatTime(visibleRange.start)} - {formatTime(visibleRange.end)}
        </div>
      </div>
      
      {/* Add marker form */}
      {showMarkerForm && (
        <div className="mt-4 p-4 bg-gray-700 border border-gray-600 rounded">
          <div className="flex items-center space-x-4">
            <input 
              type="text"
              className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2"
              placeholder="Marker name"
              value={markerForm.name}
              onChange={(e) => setMarkerForm({ ...markerForm, name: e.target.value })}
              data-testid="marker-name-input"
            />
            <input 
              type="color"
              className="w-10 h-10 border border-gray-600 rounded bg-transparent"
              value={markerForm.color}
              onChange={(e) => setMarkerForm({ ...markerForm, color: e.target.value })}
              data-testid="marker-color-input"
            />
            <button 
              className="bg-indigo-600 hover:bg-indigo-700 rounded px-4 py-2"
              onClick={handleAddMarker}
              data-testid="confirm-add-marker"
            >
              Add
            </button>
            <button 
              className="bg-gray-600 hover:bg-gray-500 rounded px-4 py-2"
              onClick={() => setShowMarkerForm(false)}
              data-testid="cancel-add-marker"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Element keyframes list (when an element is selected) */}
      {selectedElement && (
        <div className="mt-4 p-4 bg-gray-700 border border-gray-600 rounded">
          <h3 className="text-sm font-semibold mb-2">Element Keyframes</h3>
          
          {(() => {
            const element = canvas.elements.find(el => el.id === selectedElement);
            if (!element || !element.timelineData || !element.timelineData.keyframes || element.timelineData.keyframes.length === 0) {
              return (
                <div className="text-sm text-gray-400">
                  No keyframes for this element. Add keyframes to animate properties over time.
                </div>
              );
            }
            
            return (
              <div className="space-y-2">
                {element.timelineData.keyframes.map((keyframe, index) => (
                  <div 
                    key={`keyframe-${index}`}
                    className="flex items-center justify-between bg-gray-800 p-2 rounded"
                    data-testid={`keyframe-${index}`}
                  >
                    <div className="text-sm">
                      Time: {formatTime(keyframe.time)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        className="bg-blue-600 hover:bg-blue-700 rounded-full w-6 h-6 flex items-center justify-center"
                        onClick={() => setPosition(keyframe.time)}
                        title="Go to keyframe"
                        data-testid={`goto-keyframe-${index}`}
                      >
                        <span className="material-icons text-xs">arrow_forward</span>
                      </button>
                      <button 
                        className="bg-red-600 hover:bg-red-700 rounded-full w-6 h-6 flex items-center justify-center"
                        onClick={() => {
                          // Remove keyframe
                          const updatedKeyframes = element.timelineData?.keyframes?.filter((_, i) => i !== index);
                          updateElement(selectedElement, {
                            timelineData: {
                              ...element.timelineData,
                              keyframes: updatedKeyframes,
                            },
                          });
                        }}
                        title="Delete keyframe"
                        data-testid={`delete-keyframe-${index}`}
                      >
                        <span className="material-icons text-xs">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default EnhancedTimeline;
