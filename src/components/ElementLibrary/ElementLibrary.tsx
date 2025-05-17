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

/**
 * Type for element category
 */
type ElementCategory = 'images' | 'text' | 'shapes' | 'stickers' | 'media';

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
  
  // State for active category
  const [activeCategory, setActiveCategory] = useState<ElementCategory>('images');
  
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
      type: element.type,
      position: { x: 100, y: 100, z: 1 },
      size: { width: 200, height: 200 },
      rotation: 0,
      opacity: 1,
      timelineData: {
        entryPoint: 0,
        exitPoint: null,
        persist: true,
        keyframes: [],
      },
      properties: { ...element.properties },
      animations: [],
    };
    
    // Add the element to the canvas
    addElement(newElement);
  };
  
  // Mock library elements for each category
  const libraryElements: Record<ElementCategory, LibraryElement[]> = {
    images: [
      {
        id: 'img-1',
        type: 'image',
        name: 'Sample Image 1',
        thumbnail: 'placeholder',
        properties: { src: 'placeholder.jpg', alt: 'Sample Image 1' },
      },
      {
        id: 'img-2',
        type: 'image',
        name: 'Sample Image 2',
        thumbnail: 'placeholder',
        properties: { src: 'placeholder.jpg', alt: 'Sample Image 2' },
      },
    ],
    text: [
      {
        id: 'text-1',
        type: 'text',
        name: 'Heading',
        thumbnail: 'placeholder',
        properties: { text: 'Heading', fontSize: 32, fontWeight: 'bold' },
      },
      {
        id: 'text-2',
        type: 'text',
        name: 'Paragraph',
        thumbnail: 'placeholder',
        properties: { text: 'Lorem ipsum dolor sit amet', fontSize: 16, fontWeight: 'normal' },
      },
    ],
    shapes: [
      {
        id: 'shape-1',
        type: 'shape',
        name: 'Rectangle',
        thumbnail: 'placeholder',
        properties: { shape: 'rectangle', fill: '#3b82f6' },
      },
      {
        id: 'shape-2',
        type: 'shape',
        name: 'Circle',
        thumbnail: 'placeholder',
        properties: { shape: 'circle', fill: '#ec4899' },
      },
    ],
    stickers: [
      {
        id: 'sticker-1',
        type: 'sticker',
        name: 'Star',
        thumbnail: 'placeholder',
        properties: { sticker: 'star', fill: '#f59e0b' },
      },
      {
        id: 'sticker-2',
        type: 'sticker',
        name: 'Heart',
        thumbnail: 'placeholder',
        properties: { sticker: 'heart', fill: '#ef4444' },
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
  };
  
  // Filter elements based on search query
  const filteredElements = searchQuery
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
          className="input"
          placeholder="Search elements..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      
      {/* Category tabs */}
      <div className="flex border-b border-gray-200">
        {(['images', 'text', 'shapes', 'stickers', 'media'] as ElementCategory[]).map(category => (
          <button
            key={category}
            className={`flex-1 py-2 text-sm font-medium ${
              activeCategory === category
                ? 'text-primary-600 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleCategoryChange(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Element grid */}
      <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-3">
        {filteredElements.map(element => (
          <div
            key={element.id}
            className="border border-gray-200 rounded-md p-2 cursor-grab hover:border-primary-300 hover:shadow-sm transition-all"
            draggable
            onDragStart={(e) => handleDragStart(e, element)}
            onClick={() => handleAddElement(element)}
          >
            {/* Element thumbnail */}
            <div className="bg-gray-100 h-20 flex items-center justify-center rounded mb-2">
              {element.type === 'text' && (
                <span style={{ fontSize: `${element.properties.fontSize / 2}px`, fontWeight: element.properties.fontWeight }}>
                  {element.properties.text}
                </span>
              )}
              {element.type === 'shape' && (
                <div
                  className={`${element.properties.shape === 'circle' ? 'rounded-full' : 'rounded'}`}
                  style={{ 
                    backgroundColor: element.properties.fill,
                    width: '40px',
                    height: '40px',
                  }}
                />
              )}
              {element.type === 'sticker' && (
                <div className="text-2xl">
                  {element.properties.sticker === 'star' ? '⭐' : '❤️'}
                </div>
              )}
              {(element.type === 'image' || element.type === 'media') && (
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
    </div>
  );
}

export default ElementLibrary;
