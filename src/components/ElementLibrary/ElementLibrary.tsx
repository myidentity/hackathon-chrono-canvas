/**
 * Updated ElementLibrary component with Material Design 3.0 layout
 */

import React, { useState } from 'react';
import { useCanvas, TimelineData } from '../../context/CanvasContext';
import { useImageLibrary } from '../../context/ImageLibraryContext';
import ToolsPalette from '../UI/ToolsPalette';
import TravelStickers, { StickerData } from '../Stickers/TravelStickers';
import { v4 as uuidv4 } from 'uuid';
import ElementLibraryHeader from './ElementLibraryHeader';
import ElementTypeNav from './ElementTypeNav';

/**
 * Type for element category
 */
type ElementCategory = 'stickers' | 'shapes' | 'text' | 'media' | 'images';

/**
 * Interface for library element
 */
interface LibraryElement {
  id: string;
  type: 'image' | 'text' | 'shape' | 'sticker' | 'media' | 'audio' | 'map';
  name: string;
  thumbnail: string;
  properties: Record<string, any>;
}

/**
 * ElementLibrary component that provides a library of elements
 * 
 * @returns {JSX.Element} The rendered ElementLibrary component
 */
const ElementLibrary = (): JSX.Element => {
  // Get canvas context
  const { addElement, clearCanvas } = useCanvas();
  
  // Get image library context
  const { images } = useImageLibrary();
  
  // State for active category - default to stickers as requested
  const [activeCategory, setActiveCategory] = useState<ElementCategory>('stickers');
  
  // Add Images Panel component
  const ImagesPanelComponent = React.lazy(() => import('./ImagesPanel'));
  
  // State for search query
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // State for clear canvas confirmation
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  
  /**
   * Handle category change
   * 
   * @param {string} category - The category to switch to
   */
  const handleCategoryChange = (category: string): void => {
    setActiveCategory(category as ElementCategory);
  };
  
  /**
   * Handle search input change
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };
  
  /**
   * Handle element drag start
   * 
   * @param {React.DragEvent} e - The drag event
   * @param {LibraryElement} element - The element being dragged
   */
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, element: LibraryElement): void => {
    e.dataTransfer.setData('application/json', JSON.stringify(element));
  };
  
  /**
   * Handle adding element to canvas
   * 
   * @param {LibraryElement} element - The element to add
   */
  const handleAddElement = (element: LibraryElement): void => {
    // Create a new canvas element from the library element
    let newElement = {
      id: `${element.type}-${uuidv4().substring(0, 8)}`,
      type: element.type,
      position: { x: 100, y: 100 },
      size: { width: 200, height: 200 },
      rotation: 0,
      opacity: 1,
      zIndex: 1,
      ...element.properties,
      timelineData: {
        entryPoint: 0,
        exitPoint: undefined,
        persist: true,
        keyframes: [
          {
            time: 0,
            properties: {
              opacity: 0,
              scale: 0.8,
            },
          },
          {
            time: 1,
            properties: {
              opacity: 1,
              scale: 1,
            },
          },
        ],
      } as TimelineData,
    };
    
    // For image elements, ensure src is at the top level
    if (element.type === 'image') {
      // If src is in properties, move it to the top level
      if (element.properties && element.properties.src) {
        newElement = {
          ...newElement,
          src: element.properties.src,
          alt: element.properties.alt || ''
        };
      }
    }
    
    // Add the element to the canvas
    addElement(newElement);
  };

  /**
   * Handle adding sticker to canvas
   * 
   * @param {StickerData} stickerData - The sticker data to add
   */
  const handleAddSticker = (stickerData: StickerData): void => {
    // Create a new sticker element
    const newSticker = {
      id: `sticker-${uuidv4().substring(0, 8)}`,
      type: 'sticker' as const,
      position: { x: stickerData.x || 100, y: stickerData.y || 100 },
      size: { width: stickerData.width || 100, height: stickerData.height || 100 },
      rotation: stickerData.rotation || 0,
      opacity: stickerData.opacity || 1,
      zIndex: stickerData.zIndex || 1,
      emoji: stickerData.emoji || '',
      name: stickerData.name || 'Sticker',
      color: stickerData.color || '#000000',
      stickerType: stickerData.stickerType || 'emoji',
      timelineData: {
        entryPoint: 0,
        exitPoint: undefined,
        persist: true,
        keyframes: [
          {
            time: 0,
            properties: {
              opacity: 0,
              scale: 0.8,
            },
          },
          {
            time: 1,
            properties: {
              opacity: 1,
              scale: 1,
            },
          },
        ],
      } as TimelineData,
    };
    
    // Add the sticker to the canvas
    addElement(newSticker);
  };
  
  /**
   * Handle clear canvas with confirmation
   */
  const handleClearCanvas = (): void => {
    setShowClearConfirm(true);
  };
  
  /**
   * Confirm and clear canvas
   */
  const confirmClearCanvas = (): void => {
    clearCanvas();
    setShowClearConfirm(false);
  };
  
  /**
   * Cancel clear canvas
   */
  const cancelClearCanvas = (): void => {
    setShowClearConfirm(false);
  };
  
  // Convert images from ImageLibraryContext to LibraryElement format
  const imageElements: LibraryElement[] = images.map(image => ({
    id: image.id,
    type: 'image',
    name: image.name || 'Image',
    thumbnail: image.thumbnail || '',
    properties: { src: image.src, alt: image.alt || '' },
  }));
  
  // Mock library elements for each category
  const libraryElements: Record<ElementCategory, LibraryElement[]> = {
    stickers: [], // Will be replaced by TravelStickers
    shapes: [], // Will be replaced by ToolsPalette
    text: [
      {
        id: 'text-1',
        type: 'text',
        name: 'Heading',
        thumbnail: 'placeholder',
        properties: { content: 'Heading', fontSize: '32px', fontWeight: 'bold', color: '#000000' },
      },
      {
        id: 'text-2',
        type: 'text',
        name: 'Paragraph',
        thumbnail: 'placeholder',
        properties: { content: 'Lorem ipsum dolor sit amet', fontSize: '16px', fontWeight: 'normal', color: '#000000' },
      },
    ],
    media: [], // Removed media elements
    images: imageElements, // Use images from ImageLibraryContext
  };
  
  // Filter elements based on search query
  const filteredElements = searchQuery
    ? libraryElements[activeCategory].filter(element => 
        element.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : libraryElements[activeCategory];
  
  return (
    <div className="h-full flex">
      {/* New Material Design 3.0 Navigation Rail */}
      <ElementTypeNav 
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />
      
      {/* Content Area with Header */}
      <div className="flex-1 flex flex-col h-full">
        {/* New Material Design 3.0 Header with Search and Clear */}
        <ElementLibraryHeader 
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onClearCanvas={handleClearCanvas}
        />
        
        {/* Element Content Area */}
        <div className="flex-1 overflow-y-auto">
          {activeCategory === 'shapes' ? (
            <div className="p-4">
              <ToolsPalette className="m-0" searchQuery={searchQuery} />
            </div>
          ) : activeCategory === 'stickers' ? (
            <div className="p-4">
              <TravelStickers onSelectSticker={handleAddSticker} searchQuery={searchQuery} />
            </div>
          ) : activeCategory === 'images' ? (
            <div className="p-4">
              <React.Suspense fallback={<div className="p-4 text-center text-surface-500">Loading Images Panel...</div>}>
                <ImagesPanelComponent onSelectImage={handleAddElement} />
              </React.Suspense>
            </div>
          ) : (
            <div className="p-4 grid grid-cols-2 gap-4">
              {filteredElements.map(element => (
                <div
                  key={element.id}
                  className="bg-surface-50 dark:bg-surface-800 rounded-lg p-3 cursor-grab 
                           hover:bg-surface-100 dark:hover:bg-surface-700 
                           shadow-md-1 hover:shadow-md-2 transition-all
                           border border-surface-200 dark:border-surface-700"
                  draggable
                  onDragStart={(e) => handleDragStart(e, element)}
                  onClick={() => handleAddElement(element)}
                >
                  {/* Element thumbnail */}
                  <div className="bg-white dark:bg-surface-900 h-24 flex items-center justify-center rounded-md mb-3">
                    {element.type === 'text' && (
                      <span style={{ 
                        fontSize: element.properties.fontSize ? element.properties.fontSize.replace('px', '') / 2 + 'px' : '16px', 
                        fontWeight: element.properties.fontWeight || 'normal'
                      }} className="dark:text-gray-200">
                        {element.properties.content || 'Text'}
                      </span>
                    )}
                    {element.type === 'shape' && (
                      <div
                        className={`${element.properties.shape === 'circle' ? 'rounded-full' : 'rounded'}`}
                        style={{ 
                          backgroundColor: element.properties.backgroundColor || '#cccccc',
                          width: '40px',
                          height: '40px',
                        }}
                      />
                    )}
                    {element.type === 'image' && (
                      <img 
                        src={element.properties.src} 
                        alt={element.properties.alt || ''} 
                        className="max-h-full max-w-full object-contain"
                      />
                    )}
                  </div>
                  
                  {/* Element name */}
                  <div className="text-sm font-medium text-surface-900 dark:text-surface-100 text-center">
                    {element.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Clear Canvas confirmation modal - Material Design 3.0 Dialog */}
      {showClearConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-surface-50 dark:bg-surface-800 rounded-lg shadow-lg max-w-md w-full m-4 overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-medium text-surface-900 dark:text-surface-50 mb-2">Clear Canvas</h3>
              <p className="mb-6 text-surface-700 dark:text-surface-300">
                Are you sure you want to clear the canvas? This will remove all elements and cannot be undone.
              </p>
            </div>
            <div className="flex justify-end p-4 bg-surface-100 dark:bg-surface-700 gap-3">
              <button 
                onClick={cancelClearCanvas}
                className="px-4 py-2 rounded-full text-primary-600 dark:text-primary-300 font-medium
                         hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors
                         focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button 
                onClick={confirmClearCanvas}
                className="px-4 py-2 rounded-full bg-error-600 text-white font-medium
                         hover:bg-error-700 transition-colors
                         focus:outline-none focus:ring-2 focus:ring-error-500"
              >
                Clear Canvas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElementLibrary;
