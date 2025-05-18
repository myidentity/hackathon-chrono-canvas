/**
 * ImageLibraryContext for ChronoCanvas
 * 
 * This context manages the session-level persistence of user-uploaded images,
 * ensuring they remain available in the image panel even after being removed from the canvas.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

// Type definitions
export interface LibraryImage {
  id: string;
  name: string;
  src: string;
  alt: string;
  thumbnail: string;
  isUserUploaded: boolean;
}

export interface ImageLibraryContextValue {
  images: LibraryImage[];
  addImage: (image: Partial<LibraryImage>) => string;
  removeImage: (id: string) => void;
}

// Create context with default values
const ImageLibraryContext = createContext<ImageLibraryContextValue>({
  images: [],
  addImage: () => '',
  removeImage: () => {},
});

/**
 * ImageLibrary context provider component
 */
export const ImageLibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with sample images
  const [images, setImages] = useState<LibraryImage[]>([
    {
      id: 'img-1',
      name: 'Sample Image 1',
      src: '/images/sample_image_1.jpg',
      alt: 'Sample Image 1',
      thumbnail: '/images/sample_image_1.jpg',
      isUserUploaded: false,
    },
    {
      id: 'img-2',
      name: 'Sample Image 2',
      src: '/images/sample_image_2.jpg',
      alt: 'Sample Image 2',
      thumbnail: '/images/sample_image_2.jpg',
      isUserUploaded: false,
    },
  ]);
  
  /**
   * Add a new image to the library
   */
  const addImage = useCallback((image: Partial<LibraryImage>) => {
    const id = `img-${Date.now()}`;
    const newImage: LibraryImage = {
      id,
      name: image.name || `Image ${images.length + 1}`,
      src: image.src || '',
      alt: image.alt || `Image ${images.length + 1}`,
      thumbnail: image.thumbnail || image.src || '',
      isUserUploaded: image.isUserUploaded !== undefined ? image.isUserUploaded : true,
    };
    
    setImages(prev => [...prev, newImage]);
    
    return id;
  }, [images.length]);
  
  /**
   * Remove an image from the library
   */
  const removeImage = useCallback((id: string) => {
    setImages(prev => prev.filter(image => image.id !== id));
  }, []);
  
  // Context value
  const contextValue: ImageLibraryContextValue = {
    images,
    addImage,
    removeImage,
  };
  
  return (
    <ImageLibraryContext.Provider value={contextValue}>
      {children}
    </ImageLibraryContext.Provider>
  );
};

/**
 * Hook to use image library context
 */
export const useImageLibrary = () => useContext(ImageLibraryContext);
