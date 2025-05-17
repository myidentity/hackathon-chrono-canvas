# ChronoCanvas Architecture

## Overview

ChronoCanvas is a web application that combines a time-based moodboard with an interactive zine-like viewing experience. The application allows users to create visual narratives by placing elements on a canvas and associating them with specific points on a timeline. Users can then view these narratives either by scrubbing through the timeline or by scrolling through the content in a zine-like format.

## Technology Stack

### Frontend
- **React**: For building the component-based UI
- **TypeScript**: For type safety and better developer experience
- **Framer Motion**: For sophisticated animations and transitions
- **Tailwind CSS**: For styling and responsive design
- **React DnD**: For drag-and-drop functionality
- **React Router**: For navigation between different views/modes

### State Management
- **React Context API**: For global state management
- **Custom hooks**: For component-specific state and logic

### Storage
- **LocalStorage**: For saving work in progress
- **JSON**: For data serialization

### Build Tools
- **Vite**: For fast development and optimized production builds
- **ESLint**: For code quality
- **Prettier**: For code formatting

### Deployment
- **GitHub Pages**: For hosting the application

## Component Architecture

### Core Components

1. **Canvas**
   - The main workspace where users place and arrange elements
   - Handles element positioning, scaling, and rotation
   - Manages selection and multi-selection of elements
   - Implements grid and alignment guides

2. **Timeline**
   - Displays a horizontal timeline with a scrubber
   - Shows visual indicators for content-dense areas
   - Provides zoom functionality
   - Allows adding named markers/chapters

3. **ElementLibrary**
   - Contains categorized elements (images, text, shapes, stickers)
   - Provides search and filtering capabilities
   - Displays previews of available elements

4. **PropertyPanel**
   - Context-sensitive panel for editing selected element properties
   - Changes based on element type (text, image, shape, etc.)
   - Includes timing controls for element appearance/disappearance

5. **ViewModeController**
   - Switches between different viewing modes:
     - Editor mode
     - Timeline mode (manual scrubbing)
     - Presentation mode (auto-playing)
     - Zine mode (scroll-triggered)

### Data Models

1. **Canvas**
   ```typescript
   interface Canvas {
     id: string;
     name: string;
     width: number;
     height: number;
     background: Background;
     elements: CanvasElement[];
     timeline: Timeline;
     createdAt: Date;
     updatedAt: Date;
   }
   ```

2. **CanvasElement**
   ```typescript
   interface CanvasElement {
     id: string;
     type: 'image' | 'text' | 'shape' | 'sticker' | 'color' | 'media';
     position: { x: number; y: number; z: number };
     size: { width: number; height: number };
     rotation: number;
     opacity: number;
     timelineData: ElementTimelineData;
     properties: ElementTypeProperties;
     animations: Animation[];
   }
   ```

3. **Timeline**
   ```typescript
   interface Timeline {
     duration: number;
     markers: TimelineMarker[];
     currentPosition: number;
   }
   ```

4. **ElementTimelineData**
   ```typescript
   interface ElementTimelineData {
     entryPoint: number;
     exitPoint: number | null; // null means element persists until the end
     keyframes: Keyframe[];
     persist: boolean; // whether element remains visible after its timeline point
   }
   ```

5. **Animation**
   ```typescript
   interface Animation {
     type: string; // e.g., 'fade', 'scale', 'slide', etc.
     duration: number;
     easing: string;
     delay: number;
     trigger: 'timeline' | 'scroll' | 'interaction';
     properties: Record<string, any>; // Animation-specific properties
   }
   ```

## Application Flow

### Editor Mode
1. User creates a new canvas or opens an existing one
2. User adds elements from the library to the canvas
3. User positions, scales, and rotates elements
4. User sets timeline entry/exit points for elements
5. User configures animations and transitions
6. User previews the result in different viewing modes
7. User saves the canvas

### Viewing Modes

#### Timeline Mode
1. User scrubs through the timeline manually
2. Elements appear/disappear based on their timeline data
3. Animations play based on timeline position

#### Presentation Mode
1. Timeline advances automatically
2. Elements appear/disappear with configured animations
3. User can pause/play/restart the presentation

#### Zine Mode
1. User scrolls through the content
2. Scroll position is mapped to timeline position
3. Elements animate based on scroll position
4. Parallax effects create depth and visual interest

## Responsive Design

The application will adapt to different screen sizes:

1. **Desktop**
   - Full editor interface with all panels visible
   - Side-by-side arrangement of canvas and properties

2. **Tablet**
   - Collapsible panels
   - Slightly simplified interface
   - Touch-friendly controls

3. **Mobile**
   - Focused interface with minimal UI
   - Bottom sheet for properties
   - Optimized touch controls
   - Vertical timeline view

## Performance Considerations

1. **Rendering Optimization**
   - Only render visible elements
   - Use React.memo for pure components
   - Implement virtualization for large element libraries

2. **Animation Performance**
   - Use hardware-accelerated properties (transform, opacity)
   - Throttle animations during scrolling
   - Batch DOM updates

3. **Asset Management**
   - Lazy load images and heavy content
   - Optimize image sizes
   - Use SVGs for icons and simple illustrations

## Accessibility

1. **Keyboard Navigation**
   - Full keyboard support for all editor functions
   - Focus management for interactive elements

2. **Screen Reader Support**
   - Semantic HTML
   - ARIA attributes
   - Meaningful alt text for images

3. **Color Contrast**
   - Ensure sufficient contrast ratios
   - Provide alternative visual indicators

## Future Extensibility

The architecture is designed to allow for future extensions:

1. **Collaboration Features**
   - Real-time collaboration
   - Comments and feedback

2. **Advanced Export Options**
   - Video export
   - PDF export
   - Embeddable widgets

3. **Template Marketplace**
   - User-created templates
   - Premium template library

4. **Integration with External Services**
   - Social media integration
   - Cloud storage providers
   - Stock photo/illustration services
