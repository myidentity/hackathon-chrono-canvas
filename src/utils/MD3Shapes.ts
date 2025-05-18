// Remove unused React import
import { v4 as uuidv4 } from 'uuid';

// Material Design 3 shapes for the ChronoCanvas application
const MD3Shapes = {
  // Basic MD3 shapes
  roundedSquare: (size: number) => {
    const width = size;
    const height = size;
    const radius = size * 0.2; // 20% corner radius for MD3 style
    
    return `M ${radius} 0 H ${width - radius} Q ${width} 0, ${width} ${radius} V ${height - radius} Q ${width} ${height}, ${width - radius} ${height} H ${radius} Q 0 ${height}, 0 ${height - radius} V ${radius} Q 0 0, ${radius} 0 Z`;
  },
  
  pill: (size: number) => {
    const width = size * 2;
    const height = size;
    const radius = height / 2;
    
    return `M ${radius} 0 H ${width - radius} Q ${width} 0, ${width} ${radius} V ${height - radius} Q ${width} ${height}, ${width - radius} ${height} H ${radius} Q 0 ${height}, 0 ${height - radius} V ${radius} Q 0 0, ${radius} 0 Z`;
  },
  
  stadium: (size: number) => {
    const width = size * 1.5;
    const height = size;
    const radius = height / 2;
    
    return `M ${radius} 0 H ${width - radius} Q ${width} 0, ${width} ${radius} V ${height - radius} Q ${width} ${height}, ${width - radius} ${height} H ${radius} Q 0 ${height}, 0 ${height - radius} V ${radius} Q 0 0, ${radius} 0 Z`;
  },
  
  // MD3 specific shapes
  extendedFAB: (size: number) => {
    const width = size * 2.5;
    const height = size;
    const radius = height / 2;
    
    return `M ${radius} 0 H ${width - radius} Q ${width} 0, ${width} ${radius} V ${height - radius} Q ${width} ${height}, ${width - radius} ${height} H ${radius} Q 0 ${height}, 0 ${height - radius} V ${radius} Q 0 0, ${radius} 0 Z`;
  },
  
  chip: (size: number) => {
    const width = size * 1.8;
    const height = size * 0.8;
    const radius = height / 2;
    
    return `M ${radius} 0 H ${width - radius} Q ${width} 0, ${width} ${radius} V ${height - radius} Q ${width} ${height}, ${width - radius} ${height} H ${radius} Q 0 ${height}, 0 ${height - radius} V ${radius} Q 0 0, ${radius} 0 Z`;
  },
  
  card: (size: number) => {
    const width = size * 1.6;
    const height = size * 1.2;
    const radius = size * 0.1; // 10% corner radius for MD3 cards
    
    return `M ${radius} 0 H ${width - radius} Q ${width} 0, ${width} ${radius} V ${height - radius} Q ${width} ${height}, ${width - radius} ${height} H ${radius} Q 0 ${height}, 0 ${height - radius} V ${radius} Q 0 0, ${radius} 0 Z`;
  },
  
  bottomSheet: (size: number) => {
    const width = size * 2;
    const height = size * 1.5;
    const radius = size * 0.2; // 20% corner radius for top corners only
    
    return `M 0 ${radius} Q 0 0, ${radius} 0 H ${width - radius} Q ${width} 0, ${width} ${radius} V ${height} H 0 Z`;
  },
  
  dialogBox: (size: number) => {
    const width = size * 1.8;
    const height = size * 1.2;
    const radius = size * 0.15; // 15% corner radius for MD3 dialogs
    
    return `M ${radius} 0 H ${width - radius} Q ${width} 0, ${width} ${radius} V ${height - radius} Q ${width} ${height}, ${width - radius} ${height} H ${radius} Q 0 ${height}, 0 ${height - radius} V ${radius} Q 0 0, ${radius} 0 Z`;
  },
  
  // Generate a unique ID for each shape
  generateId: () => {
    return uuidv4();
  }
};

export default MD3Shapes;
