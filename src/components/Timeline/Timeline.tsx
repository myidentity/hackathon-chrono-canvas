/**
 * Timeline component for ChronoCanvas.
 * 
 * This component renders the timeline interface where users can scrub through
 * the timeline and manage timeline markers.
 * 
 * @module Timeline
 */

import { useRef, useState, useEffect } from 'react';
import { useTimeline } from '../../context/TimelineContext';

/**
 * Timeline component that renders the timeline interface
 * 
 * @returns {JSX.Element} The rendered Timeline component
 */
function Timeline(): JSX.Element {
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
    seekToMarker
  } = useTimeline();
  
  // Reference to the timeline container element
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // State for tracking if the scrubber is being dragged
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  // Calculate the percentage position for the scrubber
  const scrubberPosition = (currentPosition / duration) * 100;
  
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
      const newPosition = percentage * duration;
      
      setCurrentPosition(Math.max(0, Math.min(newPosition, duration)));
    }
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
        const newPosition = percentage * duration;
        
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
  }, [isDragging, duration, setCurrentPosition]);
  
  return (
    <div className="h-full flex flex-col p-4">
      {/* Timeline controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {/* Play/Pause button */}
          <button 
            className="btn btn-outline p-2"
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
          </button>
          
          {/* Current time display */}
          <div className="text-sm font-mono">
            {formatTime(currentPosition)} / {formatTime(duration)}
          </div>
        </div>
        
        {/* Playback speed controls */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Speed:</span>
          {[0.5, 1, 1.5, 2].map(speed => (
            <button
              key={speed}
              className={`px-2 py-1 text-xs rounded ${playbackSpeed === speed ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              onClick={() => handleSpeedChange(speed)}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
      
      {/* Timeline track */}
      <div 
        ref={timelineRef}
        className="relative h-8 bg-gray-200 rounded-md cursor-pointer"
        onClick={handleTimelineClick}
      >
        {/* Timeline progress */}
        <div 
          className="absolute top-0 left-0 h-full bg-primary-200 rounded-l-md"
          style={{ width: `${scrubberPosition}%` }}
        />
        
        {/* Timeline markers */}
        {markers.map(marker => (
          <div
            key={marker.id}
            className="absolute top-0 w-1 h-full cursor-pointer hover:bg-opacity-80"
            style={{ 
              left: `${(marker.position / duration) * 100}%`,
              backgroundColor: marker.color,
            }}
            title={marker.name}
            onClick={(e) => {
              e.stopPropagation();
              seekToMarker(marker.id);
            }}
          />
        ))}
        
        {/* Timeline scrubber */}
        <div
          className="absolute top-0 w-1 h-full bg-primary-500 cursor-ew-resize"
          style={{ left: `${scrubberPosition}%` }}
          onMouseDown={handleScrubberMouseDown}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary-500 rounded-full" />
        </div>
      </div>
      
      {/* Timeline zoom and additional controls could be added here */}
    </div>
  );
}

export default Timeline;
