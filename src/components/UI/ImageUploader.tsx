/**
 * ImageUploader component for ChronoCanvas
 * 
 * This component provides a simple file picker for uploading images
 * to be used in the canvas.
 */

import React, { useState, useRef } from 'react';

interface ImageUploaderProps {
  onImageUploaded?: (imageUrl: string) => void;
  className?: string;
}

/**
 * ImageUploader component
 * Provides a simple file picker for uploading images
 * 
 * @param {ImageUploaderProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUploaded,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  /**
   * Handle file selection
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} event - File input change event
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }
    
    // Reset error state
    setUploadError(null);
    setIsUploading(true);
    
    // Create a URL for the selected file
    const imageUrl = URL.createObjectURL(file);
    
    // Simulate upload delay for better UX
    setTimeout(() => {
      setIsUploading(false);
      
      // Call the callback with the image URL
      if (onImageUploaded) {
        onImageUploaded(imageUrl);
      }
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 500);
  };
  
  /**
   * Trigger file input click
   */
  const handleButtonClick = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {/* Upload button */}
      <button
        onClick={handleButtonClick}
        disabled={isUploading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 flex items-center"
      >
        <span className="material-icons mr-2">upload</span>
        {isUploading ? 'Uploading...' : 'Upload Image'}
      </button>
      
      {/* Error message */}
      {uploadError && (
        <p className="text-red-500 mt-2 text-sm">{uploadError}</p>
      )}
    </div>
  );
};

export default ImageUploader;
