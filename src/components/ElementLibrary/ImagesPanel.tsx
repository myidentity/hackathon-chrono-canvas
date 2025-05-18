import React, { useState, useEffect, useCallback } from 'react';
import { useImageLibrary } from '../../context/ImageLibraryContext';
import './MediaPanel.css'; // Reusing the existing CSS for now

interface ImagesPanelProps {
  onSelectImage: (image: any) => void;
}

const ImagesPanel: React.FC<ImagesPanelProps> = ({ onSelectImage }) => {
  const { images, addImage } = useImageLibrary();
  const [sampleImage, setSampleImage] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Set up sample image
    setSampleImage({
      src: '/images/sample-landscape.jpg',
      name: 'Sample Landscape',
      alt: 'Beautiful landscape scene'
    });
  }, []);

  const handleImageClick = (image: any) => {
    onSelectImage({ type: 'image', ...image });
  };

  // Handle file drop for image upload
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string;
          
          // Cache the image in localStorage
          try {
            const imageKey = `chrono-canvas-image-${Date.now()}`;
            localStorage.setItem(imageKey, imageUrl);
            
            // Add to image library
            addImage({
              src: imageUrl,
              name: file.name,
              alt: file.name,
              thumbnail: imageUrl,
              isUserUploaded: true
            });
          } catch (error) {
            console.error('Error caching image:', error);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }, [addImage]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div 
      className="media-panel"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <h3>Images</h3>
      
      {/* Drop zone indicator */}
      {isDragging && (
        <div className="drop-zone">
          <div className="drop-zone-message">
            Drop images here
          </div>
        </div>
      )}
      
      <div className="media-grid">
        {/* Display sample image */}
        {sampleImage && (
          <div 
            key="sample-image" 
            className="media-item image-item"
            onClick={() => handleImageClick(sampleImage)}
            title={sampleImage.name || ""}
          >
            <img src={sampleImage.src} alt={sampleImage.alt} />
          </div>
        )}
        
        {/* Display user-added images */}
        {images.map((image, index) => (
          <div 
            key={`image-${index}`} 
            className="media-item image-item"
            onClick={() => handleImageClick(image)}
            title={image.name || ""}
          >
            <img src={image.src} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagesPanel;

export default ImagesPanel;
