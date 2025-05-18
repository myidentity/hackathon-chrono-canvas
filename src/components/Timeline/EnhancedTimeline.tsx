/**
 * Enhanced Timeline component for ChronoCanvas
 * 
 * This component extends the basic Timeline with additional features
 * such as keyframe management, advanced marker controls, and visual enhancements.
 * It provides a more sophisticated interface for timeline manipulation.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useTimeline } from '../../context/TimelineContext';
import { useCanvas, TimelineData as CanvasTimelineData } from '../../context/CanvasContext';

// Define TimelineMarker interface
interface TimelineMarker {
  id: string;
  position: number;
  name: string;
  color: string;
}

interface EnhancedTimelineProps {
  mode?: 'editor' | 'timeline' | 'zine' | 'presentation';
}

interface VisibleRange {
  start: number;
  end: number;
}

interface MarkerFormState {
  name: string;
  color: string;
}

interface KeyframeProperties {
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  rotation: number;
  opacity: number;
}

// Use the TimelineData interface from CanvasContext
type TimelineData = CanvasTimelineData;

/**
 * EnhancedTimeline component
 * Provides advanced timeline controls with keyframe management and visual enhancements
 * 
 * @param {EnhancedTimelineProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
const EnhancedTimeline: React.FC<EnhancedTimelineProps> = () => {
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
    seekToMarker
  } = useTimeline();
  
  const { canvas, selectedElement, updateElement } = useCanvas();
  
  // State for timeline interaction
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const [visibleRange, setVisibleRange] = useState<VisibleRange>({ 
    start: 0, 
    end: duration || 60 
  });
  const [showMarkerForm, setShowMarkerForm] = useState<boolean>(false);
  const [markerForm, setMarkerForm] = useState<MarkerFormState>({ 
    name: '', 
    color: '#3b82f6' 
  });
  
  // Refs for DOM elements
  const timelineRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  
  // Update visible range when duration changes
  useEffect(() => {
    setVisibleRange({ 
      start: 0, 
      end: duration || 60 
    });
  }, [duration]);
  
  /**
   * Format time as MM:SS
   * 
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time string
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  /**
   * Handle timeline click for seeking
   * 
   * @param {React.MouseEvent<HTMLDivElement>} e - Mouse event
   */
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = clickPosition / rect.width;
    
    // Calculate position based on visible range
    const visibleDuration = visibleRange.end - visibleRange.start;
    const newPosition = visibleRange.start + (percentage * visibleDuration);
    
    setPosition(newPosition);
  };
  
  /**
   * Handle mouse down on playhead for dragging
   */
  const handlePlayheadMouseDown = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setIsDragging(true);
    
    // Pause playback while dragging
    if (isPlaying) {
      togglePlayback();
    }
    
    // Add document-level event listeners for drag and release
    document.addEventListener('mousemove', handlePlayheadDrag);
    document.addEventListener('mouseup', handlePlayheadRelease);
  };
  
  /**
   * Handle playhead drag
   */
  const handlePlayheadDrag = (e: MouseEvent): void => {
    if (!isDragging || !timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const dragPosition = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, dragPosition / rect.width));
    
    // Calculate position based on visible range
    const visibleDuration = visibleRange.end - visibleRange.start;
    const newPosition = visibleRange.start + (percentage * visibleDuration);
    
    setPosition(newPosition);
  };
  
  /**
   * Handle playhead release
   */
  const handlePlayheadRelease = (): void => {
    setIsDragging(false);
    
    // Remove document-level event listeners
    document.removeEventListener('mousemove', handlePlayheadDrag);
    document.removeEventListener('mouseup', handlePlayheadRelease);
  };
  
  /**
   * Add a marker at the current position
   */
  const handleAddMarker = (): void => {
    if (!markerForm.name.trim()) return;
    
    const newMarker: TimelineMarker = {
      id: `marker-${Date.now()}`,
      position: currentPosition,
      name: markerForm.name.trim(),
      color: markerForm.color
    };
    
    addMarker(newMarker);
    
    // Reset form
    setMarkerForm({ name: '', color: '#3b82f6' });
    setShowMarkerForm(false);
  };
  
  /**
   * Add a keyframe at the current position for the selected element
   */
  const handleAddKeyframe = (): void => {
    if (!selectedElement) return;
    
    // Find the selected element
    const element = canvas.elements.find(el => el.id === selectedElement);
    if (!element) return;
    
    // Get current properties for the keyframe
    const keyframeProperties: KeyframeProperties = {
      position: { 
        x: element.position?.x || 0, 
        y: element.position?.y || 0 
      },
      size: { 
        width: element.size?.width || 100, 
        height: element.size?.height || 100 
      },
      rotation: element.rotation || 0,
      opacity: element.opacity !== undefined ? element.opacity : 1,
    };
    
    // Create or update timeline data with the new keyframe
    const timelineData: TimelineData = element.timelineData || {
      entryPoint: currentPosition,
      exitPoint: undefined,
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
    
    // Update the element
    updateElement(selectedElement, { timelineData });
    
    // Add a marker for this keyframe
    const marker: TimelineMarker = {
      id: `keyframe-${selectedElement}-${Date.now()}`,
      position: currentPosition,
      name: `${element.type || 'Element'} Keyframe`,
      color: '#3b82f6'
    };
    
    addMarker(marker);
  };
  
  /**
   * Zoom the timeline in or out
   * 
   * @param {number} factor - Zoom factor
   */
  const handleZoom = (factor: number): void => {
    const newZoom = Math.max(0.5, Math.min(10, zoom * factor));
    setZoom(newZoom);
    
    // Adjust visible range based on zoom
    const visibleDuration = (duration || 60) / newZoom;
    const center = (visibleRange.start + visibleRange.end) / 2;
    const halfDuration = visibleDuration / 2;
    
    setVisibleRange({
      start: Math.max(0, center - halfDuration),
      end: Math.min(duration || 60, center + halfDuration),
    });
  };
  
  /**
   * Pan the timeline left or right
   * 
   * @param {number} direction - Direction to pan (-1 for left, 1 for right)
   */
  const handlePan = (direction: number): void => {
    const visibleDuration = visibleRange.end - visibleRange.start;
    const panAmount = visibleDuration * 0.2 * direction;
    
    let newStart = visibleRange.start + panAmount;
    let newEnd = visibleRange.end + panAmount;
    
    // Ensure we don't pan beyond the timeline bounds
    if (newStart < 0) {
      newStart = 0;
      newEnd = visibleDuration;
    } else if (newEnd > (duration || 60)) {
      newEnd = duration || 60;
      newStart = newEnd - visibleDuration;
    }
    
    setVisibleRange({ start: newStart, end: newEnd });
  };
  
  // Calculate playhead position based on current position and visible range
  const playheadPosition = (() => {
    const visibleDuration = visibleRange.end - visibleRange.start;
    const positionInRange = currentPosition - visibleRange.start;
    return (positionInRange / visibleDuration) * 100;
  })();
  
  return (
    <div className="w-full bg-gray-100 border-t border-gray-200 p-4">
      {/* Timeline controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {/* Time display */}
          <div className="text-sm font-mono">
            {formatTime(currentPosition)} / {formatTime(duration || 60)}
          </div>
          
          {/* Playback speed */}
          <select 
            className="ml-4 bg-white border border-gray-300 rounded px-2 py-1 text-sm"
            value={playbackSpeed.toString()}
            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
          >
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Zoom controls */}
          <button 
            className="bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center"
            onClick={() => handleZoom(0.8)}
            aria-label="Zoom out"
          >
            <span className="material-icons text-sm">zoom_out</span>
          </button>
          <button 
            className="bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center"
            onClick={() => handleZoom(1.25)}
            aria-label="Zoom in"
          >
            <span className="material-icons text-sm">zoom_in</span>
          </button>
          
          {/* Pan controls */}
          <button 
            className="bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center"
            onClick={() => handlePan(-1)}
            aria-label="Pan left"
          >
            <span className="material-icons text-sm">chevron_left</span>
          </button>
          <button 
            className="bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center"
            onClick={() => handlePan(1)}
            aria-label="Pan right"
          >
            <span className="material-icons text-sm">chevron_right</span>
          </button>
          
          {/* Play/Pause button */}
          <button 
            className="bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center"
            onClick={togglePlayback}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <span className="material-icons">pause</span>
            ) : (
              <span className="material-icons">play_arrow</span>
            )}
          </button>
          
          {/* Add marker button */}
          <button 
            className="bg-white border border-gray-300 rounded px-3 py-1 text-sm"
            onClick={() => setShowMarkerForm(true)}
          >
            Add Marker
          </button>
          
          {/* Add keyframe button */}
          <button 
            className={`bg-white border border-gray-300 rounded px-3 py-1 text-sm ${!selectedElement ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleAddKeyframe}
            disabled={!selectedElement}
          >
            Add Keyframe
          </button>
        </div>
      </div>
      
      {/* Timeline track */}
      <div 
        ref={timelineRef}
        className="w-full h-12 bg-gray-200 rounded-lg relative mb-4 cursor-pointer"
        onClick={handleTimelineClick}
      >
        {/* Time markers */}
        {(() => {
          const markers = [];
          const visibleDuration = visibleRange.end - visibleRange.start;
          const interval = visibleDuration > 60 ? 10 : visibleDuration > 30 ? 5 : 1;
          
          for (let i = Math.ceil(visibleRange.start / interval) * interval; i <= visibleRange.end; i += interval) {
            const position = ((i - visibleRange.start) / visibleDuration) * 100;
            
            markers.push(
              <div 
                key={`time-${i}`}
                className="absolute top-0 h-full border-l border-gray-400"
                style={{ left: `${position}%` }}
              >
                <div className="absolute top-0 -ml-4 text-xs text-gray-600">
                  {formatTime(i)}
                </div>
              </div>
            );
          }
          
          return markers;
        })()}
        
        {/* Element entry/exit points */}
        {canvas.elements.map(element => {
          if (!element.timelineData) return null;
          
          const entryPoint = element.timelineData.entryPoint;
          const exitPoint = element.timelineData.exitPoint;
          
          if (entryPoint === undefined) return null;
          
          const entryPosition = ((entryPoint - visibleRange.start) / (visibleRange.end - visibleRange.start)) * 100;
          
          // Only render if within visible range
          if (entryPosition < 0 || entryPosition > 100) return null;
          
          return (
            <React.Fragment key={`entry-${element.id}`}>
              <div 
                className="absolute top-0 h-full border-l-2 border-green-500"
                style={{ left: `${entryPosition}%` }}
                title={`${element.type || 'Element'} Entry: ${formatTime(entryPoint)}`}
              />
              
              {exitPoint !== undefined && (
                <div 
                  className="absolute top-0 h-full border-l-2 border-red-500"
                  style={{ 
                    left: `${((exitPoint - visibleRange.start) / (visibleRange.end - visibleRange.start)) * 100}%`,
                    display: ((exitPoint - visibleRange.start) / (visibleRange.end - visibleRange.start)) * 100 < 0 || 
                             ((exitPoint - visibleRange.start) / (visibleRange.end - visibleRange.start)) * 100 > 100 ? 'none' : 'block'
                  }}
                  title={`${element.type || 'Element'} Exit: ${formatTime(exitPoint)}`}
                />
              )}
            </React.Fragment>
          );
        })}
        
        {/* Markers */}
        {markers.map((marker) => {
          const markerPosition = ((marker.position - visibleRange.start) / (visibleRange.end - visibleRange.start)) * 100;
          
          // Only render if within visible range
          if (markerPosition < 0 || markerPosition > 100) return null;
          
          return (
            <div 
              key={marker.id}
              className="absolute top-0 h-full"
              style={{ left: `${markerPosition}%` }}
              title={marker.name}
              onClick={(e) => {
                e.stopPropagation();
                seekToMarker(marker.id);
              }}
            >
              <div 
                className="absolute top-0 w-2 h-full -ml-1 cursor-pointer"
                style={{ backgroundColor: marker.color || '#3b82f6' }}
              />
              <div className="absolute bottom-0 -ml-2 mb-2 w-4 h-4 rounded-full cursor-pointer"
                style={{ backgroundColor: marker.color || '#3b82f6' }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeMarker(marker.id);
                }}
              >
                <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white text-xs">
                  ×
                </span>
              </div>
            </div>
          );
        })}
        
        {/* Playhead */}
        <div 
          ref={playheadRef}
          className="absolute top-0 h-full"
          style={{ left: `${playheadPosition}%` }}
        >
          <div 
            className="absolute top-0 w-1 h-full bg-indigo-700"
            onMouseDown={handlePlayheadMouseDown}
          />
          <div 
            className="absolute top-0 w-4 h-4 bg-indigo-700 rounded-full -ml-2 -mt-2 cursor-move"
            onMouseDown={handlePlayheadMouseDown}
          />
        </div>
      </div>
      
      {/* Add marker dialog */}
      {showMarkerForm && (
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded">
          <div className="flex items-center space-x-4">
            <input 
              type="text"
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              placeholder="Marker name"
              value={markerForm.name}
              onChange={(e) => setMarkerForm({ ...markerForm, name: e.target.value })}
            />
            <input 
              type="color"
              className="w-10 h-10 border border-gray-300 rounded"
              value={markerForm.color}
              onChange={(e) => setMarkerForm({ ...markerForm, color: e.target.value })}
            />
            <button 
              className="bg-indigo-600 text-white rounded px-4 py-2"
              onClick={handleAddMarker}
            >
              Add
            </button>
            <button 
              className="bg-gray-200 rounded px-4 py-2"
              onClick={() => setShowMarkerForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedTimeline;
