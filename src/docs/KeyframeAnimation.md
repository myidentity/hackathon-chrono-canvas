# Keyframe Animation Documentation

## Overview

The keyframe animation system in ChronoCanvas allows users to create smooth animations by defining key states for elements at specific points in time. The system automatically interpolates between these states to create fluid transitions.

## Core Concepts

### Keyframes
A keyframe represents the state of an element at a specific point in time. Each keyframe stores:
- Timeline position (in seconds)
- Element properties (position, size, rotation, opacity, etc.)
- Interpolation settings for transitions

### Interpolation
Interpolation is the process of calculating intermediate values between keyframes. ChronoCanvas supports:
- Ease In-Out interpolation (currently implemented)
- Future support planned for: Linear, Ease In, Ease Out, Bounce, and Custom

### Element Visibility
- Elements are only visible at/after their first keyframe
- Before their first keyframe, elements don't appear in the presentation

## Data Model

### Keyframe Structure
```typescript
interface Keyframe {
  id: string;                   // Unique identifier
  elementId: string;            // Associated element ID
  time: number;                 // Timeline position in seconds
  properties: {                 // Properties at this keyframe
    position?: { x: number, y: number };
    size?: { width: number, height: number };
    rotation?: number;
    opacity?: number;
    color?: string;
    backgroundColor?: string;
    [key: string]: any;         // Other element-specific properties
  };
  interpolationType?: {         // Interpolation settings
    position?: 'easeInOut';     // Currently only easeInOut is implemented
    size?: 'easeInOut';
    rotation?: 'easeInOut';
    opacity?: 'easeInOut';
    [key: string]: 'easeInOut' | undefined;
  };
}
```

### Element Timeline Data
```typescript
interface ElementTimelineData {
  elementId: string;            // Associated element ID
  keyframes: Keyframe[];        // Array of keyframes for this element
  visible: boolean;             // Whether element track is expanded/visible
  color: string;                // Color for this element's keyframes
}
```

## User Interface

### Timeline Visualization
- Diamond-shaped markers (color: #F26D5B) represent keyframes on the timeline
- Keyframes appear when elements are selected
- Multiple element selection shows keyframes for all selected elements
- Connecting lines between consecutive keyframes show transitions

### Keyframe Management
1. **Creating Keyframes**:
   - Select an element on canvas
   - Move the timeline scrubber to desired position
   - Modify any properties (position, size, rotation, etc.)
   - Click "Add Keyframe" button or use keyboard shortcut (K)

2. **Selecting Keyframes**:
   - Click on a keyframe marker to select it
   - The timeline scrubber jumps to that position
   - The canvas updates to show element state at that keyframe

3. **Editing Keyframes**:
   - Select a keyframe
   - Modify element properties on canvas or in properties panel
   - Changes automatically update the selected keyframe

4. **Deleting Keyframes**:
   - Select a keyframe
   - Press Delete key or use context menu
   - Different behaviors based on position:
     - If deleting the only keyframe: Element reverts to default properties
     - If deleting a middle keyframe: Animation recalculates between remaining keyframes
     - If deleting first keyframe: Next keyframe becomes the element's initial appearance point

## Animation Playback

### Controls
- Play/Pause button toggles animation playback
- Timeline scrubber can be dragged for manual preview
- Step forward/backward buttons for frame-by-frame review
- Playback speed selector (0.25x to 4x)

### Preview
- Real-time preview when scrubbing timeline
- Canvas updates to show interpolated element states
- All animatable properties update smoothly

## Implementation Details

### Interpolation Algorithm
The current implementation uses Ease In-Out interpolation for all properties:

```typescript
function easeInOutInterpolation(start: number, end: number, progress: number, power: number = 2): number {
  let easedProgress;
  if (progress < 0.5) {
    easedProgress = Math.pow(2 * progress, power) / 2;
  } else {
    easedProgress = 1 - Math.pow(2 * (1 - progress), power) / 2;
  }
  return start + (end - start) * easedProgress;
}
```

### Property-Specific Interpolation
Different property types require specific interpolation handling:

1. **Numeric Properties** (opacity, rotation, etc.):
   - Direct application of easing function

2. **Position Properties** (x, y coordinates):
   - Apply easing to both x and y independently

3. **Size Properties** (width, height):
   - Apply easing to both width and height independently

4. **Color Properties**:
   - Convert to RGB
   - Interpolate each component
   - Convert back to hex/rgb format

## Integration Points

### Timeline-Canvas Integration
1. **Element Creation**:
   - When an element is added to canvas, it automatically receives an initial keyframe at the current timeline position

2. **Timeline Scrubbing**:
   - When timeline position changes, calculate interpolated properties for all elements
   - Update canvas elements with interpolated properties

3. **Keyframe Selection**:
   - When keyframe is selected, move timeline position to keyframe time
   - Update canvas to show element state at that keyframe

4. **Keyframe Editing**:
   - When element properties are changed with keyframe selected, update keyframe data
   - Recalculate interpolation for affected properties

## Best Practices

1. **Keyframe Spacing**:
   - Place keyframes at significant points of change
   - Avoid too many keyframes close together (creates jerky animation)
   - Use fewer keyframes for smoother, more natural motion

2. **Property Animation**:
   - Not all properties need to change in every keyframe
   - Focus on the properties that create the desired effect
   - Consider the visual impact of each animated property

3. **Performance Considerations**:
   - Animating many elements simultaneously may impact performance
   - Complex properties (filters, shadows) are more resource-intensive
   - Test animations on target devices for optimal performance

## Future Enhancements

1. **Additional Interpolation Types**:
   - Linear, Ease In, Ease Out, Bounce, and Custom interpolation
   - Property-specific interpolation settings

2. **Advanced Keyframe Features**:
   - Keyframe copying/pasting
   - Multi-element keyframe synchronization
   - Keyframe templates and presets

3. **Animation Path Visualization**:
   - Visual representation of motion paths
   - Direct manipulation of motion curves
   - Bezier curve editing for custom easing
