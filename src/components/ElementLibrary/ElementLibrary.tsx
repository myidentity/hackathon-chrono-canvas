/**
 * ElementLibrary component for ChronoCanvas.
 * 
 * This component provides a library of elements that users can add to the canvas,
 * including images, text, shapes, stickers, and media.
 * 
 * @module ElementLibrary
 */

import React, { useState } from 'react';
import { useCanvas, TimelineData } from '../../context/CanvasContext';
import { useImageLibrary } from '../../context/ImageLibraryContext';
import ToolsPalette from '../UI/ToolsPalette';
import TravelStickers, { StickerData } from '../Stickers/TravelStickers';
import MaterialTabs from '../UI/MaterialTabs';
import { v4 as uuidv4 } from 'uuid';

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
    const newElement = {
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
    <div className="h-full flex flex-col">
      {/* Search input and Clear Canvas button */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center">
        <input
          type="text"
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:text-gray-200"
          placeholder="Search elements..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button
          onClick={handleClearCanvas}
          className="ml-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center"
          title="Clear Canvas"
        >
          <span className="material-icons text-sm mr-1">delete</span>
          Clear
        </button>
      </div>
      
       {/* Category tabs with Material Design - reordered as requested */}
      <MaterialTabs
        tabs={[
          { label: 'Stickers', value: 'stickers' },
          { label: 'Shapes', value: 'shapes' },
          { label: 'Text', value: 'text' },
          { label: 'Images', value: 'images' }
        ]}
        value={activeCategory}
        onChange={handleCategoryChange}
      />
      
      {/* Element grid, ToolsPalette, or TravelStickers */}
      {activeCategory === 'shapes' ? (
        <div className="flex-1 overflow-y-auto">
          <ToolsPalette className="m-3" searchQuery={searchQuery} />
        </div>
      ) : activeCategory === 'stickers' ? (
        <div className="flex-1 overflow-y-auto">
          <TravelStickers onSelectSticker={handleAddSticker} searchQuery={searchQuery} />
        </div>
      ) : activeCategory === 'images' ? (
        <div className="flex-1 overflow-y-auto">
          <React.Suspense fallback={<div>Loading Images Panel...</div>}>
            <ImagesPanelComponent onSelectImage={handleAddElement} />
          </React.Suspense>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-3">
          {filteredElements.map(element => (
            <div
              key={element.id}
              className="border border-gray-200 dark:border-gray-700 rounded-md p-2 cursor-grab hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-sm transition-all dark:bg-gray-800"
              draggable
              onDragStart={(e) => handleDragStart(e, element)}
              onClick={() => handleAddElement(element)}
            >
              {/* Element thumbnail */}
              <div className="bg-gray-100 dark:bg-gray-700 h-20 flex items-center justify-center rounded mb-2">
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
                {element.type === 'media' && (
                  <div className="text-gray-400 dark:text-gray-300 text-xs">
                    {element.name}
                  </div>
                )}
              </div>
              
              {/* Element name */}
              <div className="text-xs text-center text-gray-700 dark:text-gray-300 truncate">
                {element.name}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Clear Canvas confirmation modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md">
            <h3 className="text-lg font-medium mb-4 dark:text-white">Clear Canvas</h3>
            <p className="mb-6 dark:text-gray-300">
              Are you sure you want to clear the canvas? This will remove all elements and cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={cancelClearCanvas}
                className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmClearCanvas}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
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
