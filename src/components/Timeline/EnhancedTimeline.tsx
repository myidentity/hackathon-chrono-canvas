/**
 * Enhanced Timeline component for ChronoCanvas
 * 
 * This component provides a rich timeline interface with scrubbing, markers,
 * and playback controls for time-based element manipulation.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useTimeline } from '../../context/TimelineContext';
import { motion, AnimatePresence } from 'framer-motion';

// Type definitions
interface EnhancedTimelineProps {
  className?: string;
}

interface MarkerFormState {
  name: string;
  color: string;
  isOpen: boolean;
}

/**
 * Enhanced Timeline component with scrubbing, markers, and playback controls
 */
const EnhancedTimeline: React.FC<EnhancedTimelineProps> = ({ className = '' }) => {
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
    addMarker,
    removeMarker,
    seekToMarker
  } = useTimeline();
  
  // State for timeline zoom
  const [zoom, setZoom] = useState(1);
  
  // State for marker form
  const [markerForm, setMarkerForm] = useState<MarkerFormState>({
    name: '',
    color: '#ff0000',
    isOpen: false,
  });
  
  // Refs for timeline track and scrubber
  const trackRef = useRef<HTMLDivElement>(null);
  const scrubberRef = useRef<HTMLDivElement>(null);
  
  // State for tracking mouse position and drag
  const [isDragging, setIsDragging] = useState(false);
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle timeline click for seeking
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (trackRef.current) {
      const rect = trackRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newPosition = percentage * duration * zoom;
      setCurrentPosition(Math.max(0, Math.min(newPosition, duration)));
    }
  };
  
  // Handle mouse down for scrubbing
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    e.preventDefault();
  };
  
  // Handle mouse move for scrubbing
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && trackRef.current) {
      const rect = trackRef.current.getBoundingClientRect();
      const moveX = e.clientX - rect.left;
      const percentage = moveX / rect.width;
      const newPosition = percentage * duration * zoom;
      setCurrentPosition(Math.max(0, Math.min(newPosition, duration)));
    }
  };
  
  // Handle mouse up to end scrubbing
  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  
  // Handle zoom in
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 2, 8));
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 2, 0.5));
  };
  
  // Handle play/pause toggle
  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };
  
  // Handle speed change
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
  };
  
  // Handle marker form open
  const handleMarkerFormOpen = () => {
    setMarkerForm(prev => ({ ...prev, isOpen: true }));
  };
  
  // Handle marker form close
  const handleMarkerFormClose = () => {
    setMarkerForm(prev => ({ ...prev, isOpen: false, name: '', color: '#ff0000' }));
  };
  
  // Handle marker form submit
  const handleMarkerFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (markerForm.name.trim()) {
      addMarker(markerForm.name.trim(), currentPosition, markerForm.color);
      handleMarkerFormClose();
    }
  };
  
  // Handle marker form input change
  const handleMarkerFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMarkerForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);
  
  return (
    <div className={`bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 ${className}`} data-testid="timeline-container">
      {/* Timeline track */}
      <div 
        ref={trackRef}
        className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-md cursor-pointer"
        onClick={handleTimelineClick}
        data-testid="timeline-track"
      >
        {/* Visible timeline section based on zoom */}
        <div 
          className="absolute top-0 left-0 h-full bg-gray-300 dark:bg-gray-600 rounded-md"
          style={{ 
            width: `${Math.min(100, (duration / (duration * zoom)) * 100)}%`,
            transform: `translateX(${(currentPosition / duration) * 100 * zoom}%)`,
          }}
        />
        
        {/* Timeline markers */}
        {markers.map(marker => (
          <div
            key={marker.id}
            className="absolute top-0 w-1 h-full cursor-pointer group"
            style={{ 
              left: `${(marker.position / (duration * zoom)) * 100}%`,
              backgroundColor: marker.color,
            }}
            onClick={(e) => {
              e.stopPropagation();
              seekToMarker(marker.id);
            }}
            data-testid="timeline-marker"
          >
            {/* Marker label */}
            <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 text-xs font-medium px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
              {marker.name}
              
              {/* Delete button */}
              <button
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  removeMarker(marker.id);
                }}
                title="Delete Marker"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
        
        {/* Timeline scrubber */}
        <div
          ref={scrubberRef}
          className="absolute top-0 w-4 h-full bg-indigo-600 rounded-md cursor-move transform -translate-x-1/2 flex items-center justify-center"
          style={{ left: `${(currentPosition / (duration * zoom)) * 100}%` }}
          onMouseDown={handleMouseDown}
          data-testid="timeline-scrubber"
        >
          <div className="w-1 h-4 bg-white rounded-full" />
        </div>
      </div>
      
      {/* Timeline controls */}
      <div className="flex items-center justify-between mt-4">
        {/* Left controls: time display */}
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium" data-testid="current-position">
            {formatTime(currentPosition)} / {formatTime(duration)}
          </div>
          
          {/* Zoom controls */}
          <div className="flex items-center space-x-2">
            <button
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={handleZoomOut}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <span className="text-xs font-medium">{zoom}x</span>
            <button
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={handleZoomIn}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Center controls: playback */}
        <div className="flex items-center space-x-2">
          {/* Play/Pause button */}
          <button
            className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={handlePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            data-testid="play-button"
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
          
          {/* Playback speed buttons */}
          <div className="flex items-center space-x-1">
            {[0.5, 1, 1.5, 2].map(speed => (
              <button
                key={speed}
                className={`px-2 py-1 text-xs font-medium rounded-md ${
                  playbackSpeed === speed
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
                onClick={() => handleSpeedChange(speed)}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
        
        {/* Right controls: markers */}
        <div className="flex items-center space-x-2">
          {/* Add marker button */}
          <button
            className="px-3 py-1 text-sm font-medium rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800"
            onClick={handleMarkerFormOpen}
            data-testid="add-marker-button"
          >
            Add Marker
          </button>
        </div>
      </div>
      
      {/* Marker form modal */}
      <AnimatePresence>
        {markerForm.isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-96"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Add Timeline Marker
              </h3>
              
              <form onSubmit={handleMarkerFormSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Marker Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={markerForm.name}
                    onChange={handleMarkerFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Marker name"
                    data-testid="marker-name-input"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Marker Color
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      name="color"
                      value={markerForm.color}
                      onChange={handleMarkerFormChange}
                      className="w-10 h-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      name="color"
                      value={markerForm.color}
                      onChange={handleMarkerFormChange}
                      className="ml-2 flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                      pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                      placeholder="#RRGGBB"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Position
                  </label>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formatTime(currentPosition)}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                    onClick={handleMarkerFormClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium rounded-md border border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    data-testid="save-marker-button"
                  >
                    Save Marker
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedTimeline;
