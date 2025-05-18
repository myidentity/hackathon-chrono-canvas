/**
 * Timeline component for ChronoCanvas
 * 
 * This component renders the timeline controls and markers for the application.
 */

import React, { useState } from 'react';
import { useTimeline } from '../../context/TimelineContext';

// Define TimelineMarker interface
interface TimelineMarker {
  id: string;
  position: number;
  name: string;
  color: string;
}

interface TimelineProps {
  mode?: 'editor' | 'timeline' | 'zine' | 'presentation';
}

/**
 * Timeline component
 * Renders timeline controls and markers
 */
const Timeline: React.FC<TimelineProps> = () => {
  // Get timeline context
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
    seekToMarker
  } = useTimeline();
  
  // State for marker creation
  const [showAddMarker, setShowAddMarker] = useState<boolean>(false);
  const [markerName, setMarkerName] = useState<string>('');
  const [markerColor, setMarkerColor] = useState<string>('#3b82f6');
  
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
    const timeline = e.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = clickPosition / rect.width;
    const newPosition = percentage * (duration || 60);
    
    setPosition(newPosition);
  };
  
  /**
   * Handle marker creation
   */
  const handleAddMarker = (): void => {
    if (markerName.trim()) {
      const newMarker: TimelineMarker = {
        id: `marker-${Date.now()}`,
        position: currentPosition,
        name: markerName.trim(),
        color: markerColor
      };
      
      addMarker(newMarker);
      setMarkerName('');
      setShowAddMarker(false);
    }
  };
  
  // Calculate timeline progress percentage safely
  const progressPercentage = duration ? (currentPosition / duration) * 100 : (currentPosition / 60) * 100;
  
  return (
    <div className="w-full bg-gray-100 border-t border-gray-200 p-4">
      {/* Timeline track */}
      <div 
        className="w-full h-8 bg-gray-200 rounded-full relative mb-4 cursor-pointer"
        onClick={handleTimelineClick}
      >
        {/* Timeline progress */}
        <div 
          className="h-full bg-indigo-500 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
        
        {/* Current position indicator */}
        <div 
          className="absolute top-0 w-4 h-8 bg-indigo-700 rounded-full -ml-2"
          style={{ left: `${progressPercentage}%` }}
        />
        
        {/* Markers */}
        {markers.map((marker) => {
          const markerPosition = duration ? (marker.position / duration) * 100 : (marker.position / 60) * 100;
          
          return (
            <div 
              key={marker.id}
              className="absolute top-0 w-2 h-8 -ml-1 cursor-pointer"
              style={{ 
                left: `${markerPosition}%`,
                backgroundColor: marker.color || '#3b82f6'
              }}
              title={marker.name}
              onClick={(e) => {
                e.stopPropagation();
                seekToMarker(marker.id);
              }}
            />
          );
        })}
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-between">
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
            onClick={() => setShowAddMarker(true)}
          >
            Add Marker
          </button>
        </div>
      </div>
      
      {/* Add marker dialog */}
      {showAddMarker && (
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded">
          <div className="flex items-center space-x-4">
            <input 
              type="text"
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              placeholder="Marker name"
              value={markerName}
              onChange={(e) => setMarkerName(e.target.value)}
            />
            <input 
              type="color"
              className="w-10 h-10 border border-gray-300 rounded"
              value={markerColor}
              onChange={(e) => setMarkerColor(e.target.value)}
            />
            <button 
              className="bg-indigo-600 text-white rounded px-4 py-2"
              onClick={handleAddMarker}
            >
              Add
            </button>
            <button 
              className="bg-gray-200 rounded px-4 py-2"
              onClick={() => setShowAddMarker(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;
