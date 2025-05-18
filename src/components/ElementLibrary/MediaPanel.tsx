import React, { useState, useEffect } from 'react';
import { useImageLibrary } from '../../context/ImageLibraryContext';
import ThailandMap from '../Maps/ThailandMap';
import './MediaPanel.css';

interface MediaPanelProps {
  onSelectMedia: (media: any) => void;
}

const MediaPanel: React.FC<MediaPanelProps> = ({ onSelectMedia }) => {
  const { images } = useImageLibrary();
  const [audioClips, setAudioClips] = useState<string[]>([]);
  const [maps, setMaps] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    // Load audio clips
    const audioFiles = [
      '/audio/thailand-travel.mp3',
      '/audio/asia-travel.mp3',
      '/audio/bali-nature.mp3',
      '/audio/upbeat-travel.mp3',
      '/audio/nature-sounds.mp3'
    ];
    setAudioClips(audioFiles);

    // Set up maps
    setMaps([
      <ThailandMap key="thailand-tourist-map" width={200} height={300} />
    ]);
  }, []);

  const handleImageClick = (image: any) => {
    onSelectMedia({ type: 'image', ...image });
  };

  const handleAudioClick = (audioSrc: string) => {
    onSelectMedia({ 
      type: 'audio', 
      src: audioSrc,
      name: audioSrc.split('/').pop()?.replace('.mp3', '') || 'Audio Clip'
    });
  };

  const handleMapClick = (index: number) => {
    onSelectMedia({
      type: 'map',
      component: maps[index],
      name: `Thailand Tourist Map ${index + 1}`
    });
  };

  return (
    <div className="media-panel">
      <h3>Media Library</h3>
      
      <div className="media-section">
        <h4>Maps</h4>
        <div className="media-grid">
          {maps.map((map, index) => (
            <div 
              key={`map-${index}`} 
              className="media-item map-item"
              onClick={() => handleMapClick(index)}
            >
              {map}
            </div>
          ))}
        </div>
      </div>

      <div className="media-section">
        <h4>Audio Clips</h4>
        <div className="media-grid">
          {audioClips.map((audioSrc, index) => (
            <div 
              key={`audio-${index}`} 
              className="media-item audio-item"
              onClick={() => handleAudioClick(audioSrc)}
            >
              <div className="audio-icon">
                <svg viewBox="0 0 24 24" width="40" height="40">
                  <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,7L15,12L10,17V7Z" />
                </svg>
              </div>
              <audio src={audioSrc} />
            </div>
          ))}
        </div>
      </div>

      <div className="media-section">
        <h4>Images</h4>
        <div className="media-grid">
          {images.map((image, index) => (
            <div 
              key={`image-${index}`} 
              className="media-item image-item"
              onClick={() => handleImageClick(image)}
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
