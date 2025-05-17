/**
 * Enhanced Timeline component for ChronoCanvas.
 * 
 * This component extends the basic Timeline with improved visual design,
 * animations, and interactive features.
 * 
 * @module EnhancedTimeline
 */

import { useRef, useState, useEffect } from 'react';
import { useTimeline } from '../../context/TimelineContext';
import { ButtonEffect } from '../UI/MicroInteractions';
import { generateTransform } from '../Animation/AnimationUtils';

/**
 * Props for the EnhancedTimeline component
 */
interface EnhancedTimelineProps {
  /**
   * Optional class name for styling
   */
  className?: string;
}

/**
 * EnhancedTimeline component that provides a visually polished timeline experience
 * 
 * @param {EnhancedTimelineProps} props - The component props
 * @returns {JSX.Element} The rendered EnhancedTimeline component
 */
function EnhancedTimeline({ className }: EnhancedTimelineProps): JSX.Element {
  // Get timeline context
  const { 
    duration, 
    currentPosition, 
    markers, 
    isPlaying,
    playbackSpeed,
    setCurrentPosition, 
    play, 
    pause,
    setPlaybackSpeed,
    seekToMarker,
    addMarker,
    removeMarker
  } = useTimeline();
  
  // Reference to the timeline container element
  const timelineRef = useRef<HTMLDivElement>(null);
  const scrubberRef = useRef<HTMLDivElement>(null);
  
  // State for tracking if the scrubber is being dragged
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  // State for timeline zoom
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [visibleRange, setVisibleRange] = useState<[number, number]>([0, duration]);
  
  // State for hover effects
  const [hoveredPosition, setHoveredPosition] = useState<number | null>(null);
  
  // State for marker creation
  const [isAddingMarker, setIsAddingMarker] = useState<boolean>(false);
  const [newMarkerName, setNewMarkerName] = useState<string>('');
  const [newMarkerPosition, setNewMarkerPosition] = useState<number>(0);
  const [newMarkerColor, setNewMarkerColor] = useState<string>('#3b82f6');
  
  // Calculate the percentage position for the scrubber
  const scrubberPosition = ((currentPosition - visibleRange[0]) / (visibleRange[1] - visibleRange[0])) * 100;
  
  /**
   * Handle mouse down event on the scrubber
   * 
   * @param {React.MouseEvent} e - The mouse event
   */
  const handleScrubberMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
  };
  
  /**
   * Handle mouse down event on the timeline
   * 
   * @param {React.MouseEvent} e - The mouse event
   */
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const clickPosition = e.clientX - rect.left;
      const percentage = clickPosition / rect.width;
      const rangeSize = visibleRange[1] - visibleRange[0];
      const newPosition = visibleRange[0] + percentage * rangeSize;
      
      setCurrentPosition(Math.max(0, Math.min(newPosition, duration)));
    }
  };
  
  /**
   * Handle mouse move over the timeline
   * 
   * @param {React.MouseEvent} e - The mouse event
   */
  const handleTimelineMouseMove = (e: React.MouseEvent) => {
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const mousePosition = e.clientX - rect.left;
      const percentage = mousePosition / rect.width;
      const rangeSize = visibleRange[1] - visibleRange[0];
      const hoverPosition = visibleRange[0] + percentage * rangeSize;
      
      setHoveredPosition(Math.max(0, Math.min(hoverPosition, duration)));
    }
  };
  
  /**
   * Handle mouse leave from the timeline
   */
  const handleTimelineMouseLeave = () => {
    setHoveredPosition(null);
  };
  
  /**
   * Handle play/pause button click
   */
  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };
  
  /**
   * Handle speed change
   * 
   * @param {number} speed - The new playback speed
   */
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
  };
  
  /**
   * Handle zoom level change
   * 
   * @param {number} level - The new zoom level
   */
  const handleZoomChange = (level: number) => {
    const newZoomLevel = Math.max(1, Math.min(10, level));
    setZoomLevel(newZoomLevel);
    
    // Adjust visible range based on zoom level
    const rangeSize = duration / newZoomLevel;
    const rangeCenter = currentPosition;
    const rangeStart = Math.max(0, rangeCenter - rangeSize / 2);
    const rangeEnd = Math.min(duration, rangeStart + rangeSize);
    
    setVisibleRange([rangeStart, rangeEnd]);
  };
  
  /**
   * Handle adding a new marker
   */
  const handleAddMarker = () => {
    if (isAddingMarker) {
      if (newMarkerName.trim()) {
        addMarker(newMarkerName, newMarkerPosition, newMarkerColor);
        setNewMarkerName('');
        setIsAddingMarker(false);
      }
    } else {
      setNewMarkerPosition(currentPosition);
      setIsAddingMarker(true);
    }
  };
  
  /**
   * Handle canceling marker creation
   */
  const handleCancelMarker = () => {
    setIsAddingMarker(false);
    setNewMarkerName('');
  };
  
  /**
   * Format time in seconds to MM:SS format
   * 
   * @param {number} timeInSeconds - The time in seconds
   * @returns {string} Formatted time string
   */
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Effect to handle global mouse events for scrubber dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        const mousePosition = e.clientX - rect.left;
        const percentage = mousePosition / rect.width;
        const rangeSize = visibleRange[1] - visibleRange[0];
        const newPosition = visibleRange[0] + percentage * rangeSize;
        
        setCurrentPosition(Math.max(0, Math.min(newPosition, duration)));
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, duration, setCurrentPosition, visibleRange]);
  
  // Effect to update visible range when duration changes
  useEffect(() => {
    const rangeSize = duration / zoomLevel;
    const rangeStart = Math.max(0, currentPosition - rangeSize / 2);
    const rangeEnd = Math.min(duration, rangeStart + rangeSize);
    
    setVisibleRange([rangeStart, rangeEnd]);
  }, [duration, zoomLevel, currentPosition]);
  
  // Effect to scroll timeline when current position goes out of visible range
  useEffect(() => {
    if (currentPosition < visibleRange[0] || currentPosition > visibleRange[1]) {
      const rangeSize = visibleRange[1] - visibleRange[0];
      const rangeStart = Math.max(0, currentPosition - rangeSize / 2);
      const rangeEnd = Math.min(duration, rangeStart + rangeSize);
      
      setVisibleRange([rangeStart, rangeEnd]);
    }
  }, [currentPosition, visibleRange, duration]);
  
  // Effect to add smooth animation to scrubber
  useEffect(() => {
    if (scrubberRef.current && !isDragging) {
      scrubberRef.current.style.transition = 'left 0.1s linear';
    } else if (scrubberRef.current) {
      scrubberRef.current.style.transition = 'none';
    }
  }, [isDragging, currentPosition]);
  
  return (
    <div className={`h-full flex flex-col p-4 ${className || ''}`}>
      {/* Timeline controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {/* Play/Pause button */}
          <ButtonEffect 
            effect="scale"
            className="p-2 rounded-full bg-white shadow-sm text-gray-700 hover:text-primary-600 focus:outline-none"
            onClick={handlePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </ButtonEffect>
          
          {/* Current time display */}
          <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
            {formatTime(currentPosition)} / {formatTime(duration)}
          </div>
        </div>
        
        {/* Playback speed controls */}
        <div className="flex items-center space-x-1">
          <span className="text-xs text-gray-600">Speed:</span>
          {[0.5, 1, 1.5, 2].map(speed => (
            <ButtonEffect
              key={speed}
              effect="glow"
              className={`px-2 py-1 text-xs rounded ${
                playbackSpeed === speed 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => handleSpeedChange(speed)}
            >
              {speed}x
            </ButtonEffect>
          ))}
        </div>
        
        {/* Zoom controls */}
        <div className="flex items-center space-x-1">
          <span className="text-xs text-gray-600">Zoom:</span>
          <ButtonEffect
            effect="scale"
            className="p-1 text-gray-600 hover:text-gray-900 bg-gray-200 rounded"
            onClick={() => handleZoomChange(zoomLevel - 1)}
            disabled={zoomLevel <= 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </ButtonEffect>
          
          <span className="text-xs font-medium w-5 text-center">{zoomLevel}x</span>
          
          <ButtonEffect
            effect="scale"
            className="p-1 text-gray-600 hover:text-gray-900 bg-gray-200 rounded"
            onClick={() => handleZoomChange(zoomLevel + 1)}
            disabled={zoomLevel >= 10}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </ButtonEffect>
        </div>
        
        {/* Marker controls */}
        <ButtonEffect
          effect="glow"
          className={`px-3 py-1 text-xs rounded-full ${
            isAddingMarker 
              ? 'bg-primary-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={handleAddMarker}
        >
          {isAddingMarker ? 'Save Marker' : 'Add Marker'}
        </ButtonEffect>
      </div>
      
      {/* Marker creation form */}
      {isAddingMarker && (
        <div className="mb-4 p-3 bg-gray-100 rounded-md flex items-center space-x-3">
          <input
            type="text"
            className="flex-1 px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Marker name"
            value={newMarkerName}
            onChange={(e) => setNewMarkerName(e.target.value)}
            autoFocus
          />
          
          <input
            type="color"
            className="w-8 h-8 rounded-md border border-gray-300 cursor-pointer"
            value={newMarkerColor}
            onChange={(e) => setNewMarkerColor(e.target.value)}
          />
          
          <input
            type="number"
            className="w-20 px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            min="0"
            max={duration}
            step="0.1"
            value={newMarkerPosition}
            onChange={(e) => setNewMarkerPosition(Number(e.target.value))}
          />
          
          <ButtonEffect
            effect="scale"
            className="p-1 text-red-500 hover:text-red-700 bg-white rounded-full"
            onClick={handleCancelMarker}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </ButtonEffect>
        </div>
      )}
      
      {/* Timeline track */}
      <div 
        ref={timelineRef}
        className="relative h-12 bg-gray-200 rounded-md cursor-pointer overflow-hidden"
        onClick={handleTimelineClick}
        onMouseMove={handleTimelineMouseMove}
        onMouseLeave={handleTimelineMouseLeave}
      >
        {/* Timeline background with time indicators */}
        <div className="absolute inset-0 flex items-end">
          {Array.from({ length: Math.ceil(duration) + 1 }).map((_, i) => {
            // Only show time indicators within visible range
            if (i < visibleRange[0] || i > visibleRange[1]) return null;
            
            const position = ((i - visibleRange[0]) / (visibleRange[1] - visibleRange[0])) * 100;
            
            return (
              <div 
                key={i} 
                className="absolute bottom-0 flex flex-col items-center"
                style={{ left: `${position}%` }}
              >
                <div className="h-2 w-px bg-gray-400" />
                {i % 5 === 0 && (
                  <div className="text-xs text-gray-500 mb-1">
                    {formatTime(i)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Timeline progress */}
        <div 
          className="absolute top-0 left-0 h-full bg-primary-100 rounded-l-md"
          style={{ width: `${scrubberPosition}%` }}
        />
        
        {/* Timeline markers */}
        {markers.map(marker => {
          // Only show markers within visible range
          if (marker.position < visibleRange[0] || marker.position > visibleRange[1]) return null;
          
          const position = ((marker.position - visibleRange[0]) / (visibleRange[1] - visibleRange[0])) * 100;
          
          return (
            <div
              key={marker.id}
              className="absolute top-0 flex flex-col items-center cursor-pointer group"
              style={{ 
                left: `${position}%`,
                zIndex: 10,
              }}
              onClick={(e) => {
                e.stopPropagation();
                seekToMarker(marker.id);
              }}
              title={marker.name}
            >
              <div 
                className="w-1 h-full bg-opacity-80 group-hover:w-2 transition-all duration-200"
                style={{ backgroundColor: marker.color }}
              />
              <div className="absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white shadow-md rounded px-2 py-1 text-xs transform -translate-x-1/2 -translate-y-full">
                <div className="font-medium">{marker.name}</div>
                <div className="text-gray-500">{formatTime(marker.position)}</div>
              </div>
              
              {/* Delete button */}
              <button
                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-0.5 shadow-sm transform translate-x-full -translate-y-1/2 text-red-500 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  removeMarker(marker.id);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          );
        })}
        
        {/* Hover indicator */}
        {hoveredPosition !== null && (
          <div
            className="absolute top-0 h-full w-px bg-gray-500 pointer-events-none"
            style={{ 
              left: `${((hoveredPosition - visibleRange[0]) / (visibleRange[1] - visibleRange[0])) * 100}%`,
              zIndex: 5,
            }}
          >
            <div className="absolute top-0 transform -translate-x-1/2 -translate-y-full bg-gray-800 text-white text-xs px-2 py-1 rounded">
              {formatTime(hoveredPosition)}
            </div>
          </div>
        )}
        
        {/* Timeline scrubber */}
        <div
          ref={scrubberRef}
          className="absolute top-0 w-1 h-full bg-primary-500 cursor-ew-resize"
          style={{ left: `${scrubberPosition}%` }}
          onMouseDown={handleScrubberMouseDown}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary-500 rounded-full shadow-md" />
        </div>
      </div>
      
      {/* Visible range indicator */}
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <div>{formatTime(visibleRange[0])}</div>
        <div className="text-center">
          {zoomLevel > 1 && (
            <span>Showing {formatTime(visibleRange[1] - visibleRange[0])} of {formatTime(duration)}</span>
          )}
        </div>
        <div>{formatTime(visibleRange[1])}</div>
      </div>
    </div>
  );
}

export default EnhancedTimeline;
