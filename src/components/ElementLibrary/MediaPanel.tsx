import React, { useState, useEffect } from 'react';
import { useImageLibrary } from '../../context/ImageLibraryContext';
import './MediaPanel.css';

interface MediaPanelProps {
  onSelectMedia: (media: any) => void;
}

const MediaPanel: React.FC<MediaPanelProps> = ({ onSelectMedia }) => {
  const { images } = useImageLibrary();
  const [sampleImage, setSampleImage] = useState<any>(null);

  useEffect(() => {
    // Set up sample image
    setSampleImage({
      src: '/images/sample-landscape.jpg',
      name: 'Sample Landscape',
      alt: 'Beautiful landscape scene'
    });
  }, []);

  const handleImageClick = (image: any) => {
    onSelectMedia({ type: 'image', ...image });
  };

  return (
    <div className="media-panel">
      <h3>Media Library</h3>
      
      <div className="media-section">
        <h4>Images</h4>
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
    </div>
  );
};

export default MediaPanel;
