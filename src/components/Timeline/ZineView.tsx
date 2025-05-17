/**
 * ZineView component for ChronoCanvas
 * 
 * This component implements the interactive zine viewer with scroll-triggered animations.
 * It transforms timeline-based content into a vertical scrolling experience.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useCanvas } from '../../context/CanvasContext';
import { useTimeline } from '../../context/TimelineContext';

interface ZineViewProps {
  className?: string;
}

/**
 * ZineView component
 * Provides an interactive scroll-triggered animation experience
 */
const ZineView: React.FC<ZineViewProps> = ({ className = '' }) => {
  // Get canvas and timeline context
  const { canvas } = useCanvas();
  const { duration, setCurrentPosition } = useTimeline();
  
  // State for scroll position
  const [scrollPosition, setScrollPosition] = useState(0);
  const [mappedTimePosition, setMappedTimePosition] = useState(0);
  const [visibleElements, setVisibleElements] = useState<string[]>([]);
  
  // Ref for the container
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate the total height based on duration (1 second = 100px)
  const totalHeight = Math.max(duration * 100, 2000);
  
  // Handle scroll events
  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const scrollTop = containerRef.current.scrollTop;
    setScrollPosition(scrollTop);
    
    // Map scroll position to timeline position
    // 1 second = 100px of scrolling
    const timePosition = scrollTop / 100;
    setMappedTimePosition(timePosition);
    
    // Update timeline context to sync with scroll position
    setCurrentPosition(timePosition);
    
    // Update visible elements based on mapped time position
    updateVisibleElements(timePosition);
  };
  
  // Update visible elements based on time position
  const updateVisibleElements = (timePosition: number) => {
    const visible: string[] = [];
    
    canvas.elements.forEach(element => {
      // Always show all elements for debugging
      visible.push(element.id);
    });
    
    setVisibleElements(visible);
    
    // Debug log
    console.log('Visible elements at time', timePosition, ':', visible);
    console.log('Total elements:', canvas.elements.length);
  };
  
  // Initialize scroll handler
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener('scroll', handleScroll);
    
    // Initial scroll event to set up visible elements
    handleScroll();
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Update visible elements when canvas changes
  useEffect(() => {
    updateVisibleElements(mappedTimePosition);
    
    // Debug log
    console.log('Canvas elements:', canvas.elements);
  }, [canvas.elements]);
  
  // Create sample elements for testing if none exist
  useEffect(() => {
    if (canvas.elements.length === 0) {
      console.log('No elements found, creating samples for testing');
    }
  }, [canvas.elements]);
  
  return (
    <div 
      ref={containerRef}
      className={`w-full h-full overflow-auto relative ${className}`}
      style={{ perspective: '1000px' }}
      data-testid="zine-view-container"
    >
      {/* Scrollable content */}
      <div 
        className="w-full relative"
        style={{ height: `${totalHeight}px` }}
        data-testid="zine-scrollable-content"
      >
        {/* Sample elements for testing */}
        <div className="absolute top-0 left-0 w-full">
          <div className="bg-blue-500 text-white p-4 m-4 rounded shadow">
            Sample Element at Top (0s)
          </div>
        </div>
        
        <div className="absolute top-[1000px] left-0 w-full">
          <div className="bg-green-500 text-white p-4 m-4 rounded shadow">
            Sample Element at 10s
          </div>
        </div>
        
        <div className="absolute top-[2000px] left-0 w-full">
          <div className="bg-red-500 text-white p-4 m-4 rounded shadow">
            Sample Element at 20s
          </div>
        </div>
        
        {/* Render actual elements */}
        {canvas.elements.map(element => {
          // Position elements at different scroll positions
          const verticalOffset = element.timelineData?.entryPoint 
            ? element.timelineData.entryPoint * 100 
            : 0;
          
          const style = {
            position: 'absolute' as const,
            top: `${verticalOffset}px`,
            left: element.position?.x ? `${element.position.x}px` : '50%',
            transform: element.position?.x ? 'none' : 'translateX(-50%)',
            width: element.size?.width ? `${element.size.width}px` : 'auto',
            height: element.size?.height ? `${element.size.height}px` : 'auto',
            zIndex: element.zIndex || 0,
          };
          
          return (
            <div 
              key={element.id} 
              style={style}
              className="border-2 border-purple-500 bg-purple-200 p-2"
              data-element-id={element.id}
            >
              {element.type === 'image' && (
                <img 
                  src={element.src || `/images/sample_image_${element.id.includes('1') ? '1' : '2'}.jpg`} 
                  alt={element.alt || 'Image'} 
                  className="max-w-full max-h-full object-contain"
                />
              )}
              {element.type === 'shape' && (
                <div 
                  className="w-full h-full" 
                  style={{ 
                    backgroundColor: element.backgroundColor || '#6366F1',
                    borderRadius: element.shape === 'circle' ? '50%' : (element.borderRadius || '0'),
                    transform: `rotate(${element.rotation || 0}deg)`,
                  }}
                />
              )}
              {element.type === 'text' && (
                <div className="w-full h-full flex items-center justify-center">
                  <p style={{ 
                    fontSize: element.fontSize || '16px',
                    fontWeight: element.fontWeight || 'normal',
                    color: element.color || '#000',
                    textAlign: element.textAlign || 'center',
                  }}>
                    {element.content || 'Text Element'}
                  </p>
                </div>
              )}
              <div className="absolute top-0 right-0 bg-white text-xs p-1">
                ID: {element.id.substring(0, 4)}
              </div>
            </div>
          );
        })}
        
        {/* Visual scroll markers */}
        <div className="absolute left-0 w-full border-t border-blue-500" style={{ top: '1000px' }}>
          <div className="bg-blue-500 text-white px-2 py-1 inline-block">10s</div>
        </div>
        <div className="absolute left-0 w-full border-t border-green-500" style={{ top: '2000px' }}>
          <div className="bg-green-500 text-white px-2 py-1 inline-block">20s</div>
        </div>
        <div className="absolute left-0 w-full border-t border-red-500" style={{ top: '3000px' }}>
          <div className="bg-red-500 text-white px-2 py-1 inline-block">30s</div>
        </div>
      </div>
      
      {/* Scroll position indicator */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-2 text-sm flex justify-between">
        <div>Scroll: {Math.round(scrollPosition)}px</div>
        <div>Time: {mappedTimePosition.toFixed(1)}s</div>
        <div>Elements: {visibleElements.length}/{canvas.elements.length}</div>
      </div>
    </div>
  );
};

export default ZineView;
