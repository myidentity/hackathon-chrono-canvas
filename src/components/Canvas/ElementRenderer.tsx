/**
 * ElementRenderer component for ChronoCanvas.
 * 
 * This component renders different types of canvas elements with appropriate
 * styling and visual effects based on their type and properties.
 * 
 * @module ElementRenderer
 */

import { useMemo } from 'react';
import { CanvasElement } from '../../context/CanvasContext';

/**
 * Props for the ElementRenderer component
 */
interface ElementRendererProps {
  /**
   * The element to render
   */
  element: CanvasElement;
  
  /**
   * Whether the element is selected
   */
  isSelected: boolean;
  
  /**
   * Optional class name for styling
   */
  className?: string;
}

/**
 * ElementRenderer component that renders different types of canvas elements
 * 
 * @param {ElementRendererProps} props - The component props
 * @returns {JSX.Element} The rendered ElementRenderer component
 */
function ElementRenderer({
  element,
  isSelected,
  className,
}: ElementRendererProps): JSX.Element {
  /**
   * Render content based on element type
   */
  const renderContent = useMemo(() => {
    switch (element.type) {
      case 'image':
        return (
          <div className="w-full h-full overflow-hidden rounded-md">
            {element.properties.src ? (
              <img
                src={element.properties.src}
                alt={element.properties.alt || 'Image'}
                className="w-full h-full object-cover"
                style={{
                  filter: element.properties.filter || 'none',
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
        );
      
      case 'text':
        return (
          <div 
            className="w-full h-full flex items-center justify-center overflow-hidden"
            style={{
              fontFamily: element.properties.fontFamily || 'inherit',
              fontSize: `${element.properties.fontSize || 16}px`,
              fontWeight: element.properties.fontWeight || 'normal',
              fontStyle: element.properties.fontStyle || 'normal',
              textDecoration: element.properties.textDecoration || 'none',
              color: element.properties.color || 'currentColor',
              textAlign: element.properties.textAlign || 'center',
              lineHeight: element.properties.lineHeight || 1.5,
              letterSpacing: element.properties.letterSpacing || 'normal',
              textShadow: element.properties.textShadow || 'none',
              padding: '8px',
            }}
          >
            {element.properties.text || 'Text Element'}
          </div>
        );
      
      case 'shape':
        const shapeBorderRadius = element.properties.shape === 'circle' ? '50%' : 
                                 element.properties.shape === 'rounded' ? '8px' : '0';
        
        return (
          <div 
            className="w-full h-full"
            style={{
              backgroundColor: element.properties.fill || '#3b82f6',
              borderRadius: shapeBorderRadius,
              border: element.properties.borderWidth ? 
                `${element.properties.borderWidth}px ${element.properties.borderStyle || 'solid'} ${element.properties.borderColor || 'currentColor'}` : 
                'none',
              boxShadow: element.properties.shadow || 'none',
            }}
          />
        );
      
      case 'sticker':
        // For stickers, we'll use emoji as placeholders
        // In a real implementation, these would be SVG or image assets
        const stickerContent = {
          'heart': '❤️',
          'star': '⭐',
          'smile': '😊',
          'thumbsUp': '👍',
          'fire': '🔥',
          'trophy': '🏆',
          'check': '✅',
          'x': '❌',
          'arrow': '➡️',
        }[element.properties.sticker as string] || '🔖';
        
        return (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            {stickerContent}
          </div>
        );
      
      case 'color':
        return (
          <div 
            className="w-full h-full"
            style={{
              background: element.properties.value || '#3b82f6',
              opacity: element.properties.opacity || 1,
            }}
          />
        );
      
      case 'media':
        if (element.properties.media === 'audio') {
          return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-md p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <div className="text-sm text-gray-700 font-medium">Audio Element</div>
              <div className="text-xs text-gray-500">{element.properties.src || 'No source'}</div>
            </div>
          );
        }
        
        if (element.properties.media === 'map') {
          return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-md p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <div className="text-sm text-gray-700 font-medium">Map Element</div>
              <div className="text-xs text-gray-500">{element.properties.location || 'No location'}</div>
            </div>
          );
        }
        
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
            <div className="text-sm">Unsupported Media Type</div>
          </div>
        );
      
      default:
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
            <div className="text-sm">Unknown Element Type</div>
          </div>
        );
    }
  }, [element]);
  
  return (
    <div 
      className={`relative ${className || ''} ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {renderContent}
      
      {/* Selection indicators */}
      {isSelected && (
        <>
          {/* Resize handles */}
          <div className="absolute top-0 left-0 w-2 h-2 bg-primary-500 rounded-full cursor-nwse-resize transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-0 right-0 w-2 h-2 bg-primary-500 rounded-full cursor-nesw-resize transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-primary-500 rounded-full cursor-nesw-resize transform -translate-x-1/2 translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-primary-500 rounded-full cursor-nwse-resize transform translate-x-1/2 translate-y-1/2" />
          
          {/* Rotation handle */}
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-primary-500 rounded-full cursor-move transform -translate-x-1/2 -translate-y-1/2 mt--16" />
        </>
      )}
    </div>
  );
}

export default ElementRenderer;
