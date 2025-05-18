import React from 'react';
import ThailandMap from './ThailandMap';

interface ThailandMapCollectionProps {
  width?: number;
  height?: number;
}

const ThailandMapCollection: React.FC<ThailandMapCollectionProps> = ({ width = 400, height = 600 }) => {
  return (
    <div className="thailand-map-collection">
      <ThailandMap width={width} height={height} />
    </div>
  );
};

export default ThailandMapCollection;
