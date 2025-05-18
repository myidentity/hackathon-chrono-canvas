// Remove unused React import
import { v4 as uuidv4 } from 'uuid';

// Additional shapes for the ChronoCanvas application
const AdditionalShapes = {
  // Basic shapes
  star: (size: number) => {
    const outerRadius = size / 2;
    const innerRadius = outerRadius * 0.4;
    const points = 5;
    let path = '';
    
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (Math.PI / points) * i;
      const x = outerRadius + radius * Math.sin(angle);
      const y = outerRadius - radius * Math.cos(angle);
      
      path += (i === 0 ? 'M' : 'L') + `${x},${y}`;
    }
    
    path += 'Z';
    
    return path;
  },
  
  heart: (size: number) => {
    const width = size;
    const height = size;
    
    // Create a heart shape path
    return `M ${width/2} ${height/4} C ${width/2} ${height/5}, ${width/5} ${height/5}, ${width/5} ${height/2.5} C ${width/5} ${height/1.5}, ${width/2} ${height/1.25}, ${width/2} ${height} C ${width/2} ${height/1.25}, ${width*4/5} ${height/1.5}, ${width*4/5} ${height/2.5} C ${width*4/5} ${height/5}, ${width/2} ${height/5}, ${width/2} ${height/4} Z`;
  },
  
  cloud: (size: number) => {
    const width = size;
    const height = size * 0.6;
    
    // Create a cloud shape path
    return `M ${width*0.2} ${height*0.6} C ${width*0.15} ${height*0.4}, ${width*0.3} ${height*0.3}, ${width*0.4} ${height*0.4} C ${width*0.4} ${height*0.2}, ${width*0.6} ${height*0.2}, ${width*0.7} ${height*0.4} C ${width*0.8} ${height*0.3}, ${width*0.9} ${height*0.4}, ${width*0.85} ${height*0.6} Z`;
  },
  
  lightning: (size: number) => {
    const width = size;
    const height = size;
    
    // Create a lightning bolt path
    return `M ${width*0.4} ${height*0.1} L ${width*0.2} ${height*0.5} L ${width*0.4} ${height*0.5} L ${width*0.3} ${height*0.9} L ${width*0.7} ${height*0.4} L ${width*0.5} ${height*0.4} L ${width*0.6} ${height*0.1} Z`;
  },
  
  // Travel-themed shapes
  airplane: (size: number) => {
    const width = size;
    const height = size * 0.5;
    
    // Create an airplane shape path
    return `M ${width*0.8} ${height*0.3} L ${width*0.7} ${height*0.5} L ${width*0.1} ${height*0.5} L ${width*0.05} ${height*0.7} L ${width*0.1} ${height*0.7} L ${width*0.2} ${height*0.5} L ${width*0.7} ${height*0.5} L ${width*0.6} ${height*0.7} L ${width*0.65} ${height*0.7} L ${width*0.8} ${height*0.5} L ${width*0.9} ${height*0.5} L ${width*0.9} ${height*0.3} Z`;
  },
  
  suitcase: (size: number) => {
    const width = size;
    const height = size * 0.8;
    
    // Create a suitcase shape path
    return `M ${width*0.2} ${height*0.2} L ${width*0.8} ${height*0.2} L ${width*0.8} ${height*0.1} L ${width*0.2} ${height*0.1} Z M ${width*0.1} ${height*0.2} L ${width*0.9} ${height*0.2} L ${width*0.9} ${height*0.9} L ${width*0.1} ${height*0.9} Z M ${width*0.4} ${height*0.5} L ${width*0.6} ${height*0.5} L ${width*0.6} ${height*0.6} L ${width*0.4} ${height*0.6} Z`;
  },
  
  camera: (size: number) => {
    const width = size;
    const height = size * 0.8;
    
    // Create a camera shape path
    return `M ${width*0.1} ${height*0.3} L ${width*0.3} ${height*0.3} L ${width*0.35} ${height*0.2} L ${width*0.65} ${height*0.2} L ${width*0.7} ${height*0.3} L ${width*0.9} ${height*0.3} L ${width*0.9} ${height*0.8} L ${width*0.1} ${height*0.8} Z M ${width*0.5} ${height*0.55} C ${width*0.6} ${height*0.55}, ${width*0.7} ${height*0.65}, ${width*0.7} ${height*0.75} C ${width*0.7} ${height*0.85}, ${width*0.6} ${height*0.95}, ${width*0.5} ${height*0.95} C ${width*0.4} ${height*0.95}, ${width*0.3} ${height*0.85}, ${width*0.3} ${height*0.75} C ${width*0.3} ${height*0.65}, ${width*0.4} ${height*0.55}, ${width*0.5} ${height*0.55} Z`;
  },
  
  compass: (size: number) => {
    const width = size;
    const height = size;
    const radius = width / 2;
    const center = { x: width / 2, y: height / 2 };
    
    // Create a compass shape path
    return `M ${center.x} ${center.y - radius} A ${radius} ${radius} 0 0 1 ${center.x + radius} ${center.y} A ${radius} ${radius} 0 0 1 ${center.x} ${center.y + radius} A ${radius} ${radius} 0 0 1 ${center.x - radius} ${center.y} A ${radius} ${radius} 0 0 1 ${center.x} ${center.y - radius} Z M ${center.x} ${center.y - radius * 0.7} L ${center.x + radius * 0.2} ${center.y + radius * 0.7} L ${center.x} ${center.y + radius * 0.4} L ${center.x - radius * 0.2} ${center.y + radius * 0.7} Z`;
  },
  
  // Generate a unique ID for each shape
  generateId: () => {
    return uuidv4();
  }
};

export default AdditionalShapes;
