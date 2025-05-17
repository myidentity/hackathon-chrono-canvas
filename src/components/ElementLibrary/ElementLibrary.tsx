/**
 * ElementLibrary component for ChronoCanvas.
 * 
 * This component provides a library of elements that users can add to the canvas,
 * including images, text, shapes, stickers, and media.
 * 
 * @module ElementLibrary
 */

import { useState } from 'react';
import { useCanvas } from '../../context/CanvasContext';
import ToolsPalette from '../UI/ToolsPalette';
import TravelStickers from '../Stickers/TravelStickers';
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
  type: 'image' | 'text' | 'shape' | 'sticker' | 'color' | 'media';
  name: string;
  thumbnail: string;
  properties: Record<string, any>;
}

/**
 * ElementLibrary component that provides a library of elements
 * 
 * @returns {JSX.Element} The rendered ElementLibrary component
 */
function ElementLibrary(): JSX.Element {
  // Get canvas context
  const { addElement } = useCanvas();
  
  // State for active category - default to stickers as requested
  const [activeCategory, setActiveCategory] = useState<ElementCategory>('stickers');
  
  // State for search query
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  /**
   * Handle category change
   * 
   * @param {ElementCategory} category - The category to switch to
   */
  const handleCategoryChange = (category: ElementCategory) => {
    setActiveCategory(category);
  };
  
  /**
   * Handle search input change
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  /**
   * Handle element drag start
   * 
   * @param {React.DragEvent} e - The drag event
   * @param {LibraryElement} element - The element being dragged
   */
  const handleDragStart = (e: React.DragEvent, element: LibraryElement) => {
    e.dataTransfer.setData('application/json', JSON.stringify(element));
  };
  
  /**
   * Handle adding element to canvas
   * 
   * @param {LibraryElement} element - The element to add
   */
  const handleAddElement = (element: LibraryElement) => {
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
        exitPoint: null,
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
      },
    };
    
    // Add the element to the canvas
    addElement(newElement);
  };

  /**
   * Handle adding sticker to canvas
   * 
   * @param {any} stickerData - The sticker data to add
   */
  const handleAddSticker = (stickerData: any) => {
    // Create a new sticker element
    const newSticker = {
      id: `sticker-${uuidv4().substring(0, 8)}`,
      type: 'sticker',
      position: { x: stickerData.x, y: stickerData.y },
      size: { width: stickerData.width, height: stickerData.height },
      rotation: stickerData.rotation,
      opacity: stickerData.opacity,
      zIndex: stickerData.zIndex,
      emoji: stickerData.emoji,
      name: stickerData.name,
      color: stickerData.color,
      stickerType: stickerData.stickerType,
      timelineData: {
        entryPoint: 0,
        exitPoint: null,
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
      },
    };
    
    // Add the sticker to the canvas
    addElement(newSticker);
  };
  
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
        properties: { content: 'Heading', fontSize: '32px', fontWeight: 'bold', color: '#000' },
      },
      {
        id: 'text-2',
        type: 'text',
        name: 'Paragraph',
        thumbnail: 'placeholder',
        properties: { content: 'Lorem ipsum dolor sit amet', fontSize: '16px', fontWeight: 'normal', color: '#000' },
      },
    ],
    media: [
      {
        id: 'media-1',
        type: 'media',
        name: 'Audio Clip',
        thumbnail: 'placeholder',
        properties: { media: 'audio', src: 'placeholder.mp3' },
      },
      {
        id: 'media-2',
        type: 'media',
        name: 'Map',
        thumbnail: 'placeholder',
        properties: { media: 'map', location: 'New York' },
      },
    ],
    images: [
      {
        id: 'img-1',
        type: 'image',
        name: 'Sample Image 1',
        thumbnail: 'placeholder',
        properties: { src: '/images/sample_image_1.jpg', alt: 'Sample Image 1' },
      },
      {
        id: 'img-2',
        type: 'image',
        name: 'Sample Image 2',
        thumbnail: 'placeholder',
        properties: { src: '/images/sample_image_2.jpg', alt: 'Sample Image 2' },
      },
    ],
  };
  
  // Filter elements based on search query
  const filteredElements = searchQuery && activeCategory !== 'shapes' && activeCategory !== 'stickers'
    ? libraryElements[activeCategory].filter(element => 
        element.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : libraryElements[activeCategory];
  
  return (
    <div className="h-full flex flex-col">
      {/* Search input */}
      <div className="p-3 border-b border-gray-200">
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search elements..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      
      {/* Category tabs - reordered as requested */}
      <div className="flex border-b border-gray-200">
        {(['stickers', 'shapes', 'text', 'media', 'images'] as ElementCategory[]).map(category => (
          <button
            key={category}
            className={`flex-1 py-2 text-sm font-medium ${
              activeCategory === category
                ? 'text-blue-600 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleCategoryChange(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Element grid, ToolsPalette, or TravelStickers */}
      {activeCategory === 'shapes' ? (
        <div className="flex-1 overflow-y-auto">
          <ToolsPalette className="m-3" />
        </div>
      ) : activeCategory === 'stickers' ? (
        <div className="flex-1 overflow-y-auto">
          <TravelStickers onSelectSticker={handleAddSticker} />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-3">
          {filteredElements.map(element => (
            <div
              key={element.id}
              className="border border-gray-200 rounded-md p-2 cursor-grab hover:border-blue-300 hover:shadow-sm transition-all"
              draggable
              onDragStart={(e) => handleDragStart(e, element)}
              onClick={() => handleAddElement(element)}
            >
              {/* Element thumbnail */}
              <div className="bg-gray-100 h-20 flex items-center justify-center rounded mb-2">
                {element.type === 'text' && (
                  <span style={{ 
                    fontSize: element.properties.fontSize.replace('px', '') / 2 + 'px', 
                    fontWeight: element.properties.fontWeight 
                  }}>
                    {element.properties.content}
                  </span>
                )}
                {element.type === 'shape' && (
                  <div
                    className={`${element.properties.shape === 'circle' ? 'rounded-full' : 'rounded'}`}
                    style={{ 
                      backgroundColor: element.properties.backgroundColor,
                      width: '40px',
                      height: '40px',
                    }}
                  />
                )}
                {element.type === 'image' && (
                  <img 
                    src={element.properties.src} 
                    alt={element.properties.alt} 
                    className="max-h-full max-w-full object-contain"
                  />
                )}
                {element.type === 'media' && (
                  <div className="text-gray-400 text-xs">
                    {element.name}
                  </div>
                )}
              </div>
              
              {/* Element name */}
              <div className="text-xs text-center text-gray-700 truncate">
                {element.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ElementLibrary;
