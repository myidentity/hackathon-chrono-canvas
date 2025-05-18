# Timeline Keyframe Visualization Design

## Overview
This document outlines the design for implementing keyframe visualization on the timeline in the ChronoCanvas project. The design ensures a one-to-one relationship between selected elements and their keyframes on the timeline.

## Current State
- The properties panel displays a list of keyframes for the selected element with delete functionality
- The timeline currently does not properly visualize keyframes for the selected element
- There is no synchronization between keyframe deletion in the properties panel and the timeline

## Requirements
1. Only show keyframes for the currently selected element on the timeline
2. When a different element is selected, update the timeline to show only that element's keyframes
3. When a keyframe is deleted from the properties panel, it should be removed from the timeline
4. Maintain a one-to-one relationship between elements and their keyframes

## Design Solution

### Data Structure
We'll leverage the existing data structure in the TimelineContext and CanvasContext:
- Each element has a `timelineData` property containing keyframes
- Keyframes have a `time` property (timestamp) and a `properties` object

### UI Components
1. **Timeline Keyframe Markers**
   - Diamond-shaped markers on the timeline representing keyframes
   - Color-coded to match the selected element
   - Only visible when their parent element is selected
   - Include hover state to show timestamp

2. **Timeline-Properties Panel Synchronization**
   - When a keyframe is deleted from the properties panel, update the timeline
   - When a keyframe is added, update both the properties panel and timeline

### Implementation Approach

#### 1. EnhancedTimeline Component Updates
- Modify the `EnhancedTimeline` component to render keyframe markers for the selected element
- Filter keyframes based on the currently selected element
- Add visual indicators for keyframes (diamond shapes)

#### 2. Selection-Based Rendering
- Add a useEffect hook to listen for changes to the selected element
- When selection changes, update the keyframe markers on the timeline

#### 3. Delete Synchronization
- Update the delete functionality in the PropertyPanel to:
  - Remove the keyframe from the element's timelineData
  - Trigger a re-render of the timeline to reflect the change

#### 4. Visual Design
- Diamond shape for keyframes (consistent with industry standards)
- Color: #F26D5B (as specified in requirements)
- Subtle animation when creating or selecting keyframes
- Thin connecting line between consecutive keyframes

## Technical Implementation Details

### EnhancedTimeline Component
```tsx
// Inside EnhancedTimeline.tsx
// Add this to render keyframes for the selected element

const renderKeyframeMarkers = () => {
  if (!selectedElement) return null;
  
  // Find the selected element
  const element = canvas.elements.find(el => el.id === selectedElement);
  if (!element || !element.timelineData || !element.timelineData.keyframes) return null;
  
  return element.timelineData.keyframes.map((keyframe, index) => {
    // Calculate position on timeline
    const keyframePosition = calculatePositionOnTimeline(keyframe.time);
    
    return (
      <div 
        key={`keyframe-${selectedElement}-${index}`}
        className="keyframe-marker"
        style={{ 
          left: `${keyframePosition}%`,
          backgroundColor: '#F26D5B'
        }}
        title={`Keyframe at ${formatTime(keyframe.time)}`}
        onClick={(e) => {
          e.stopPropagation();
          setPosition(keyframe.time);
        }}
      />
    );
  });
};
```

### PropertyPanel Component
```tsx
// Inside PropertyPanel.tsx
// Update the delete keyframe function

const handleDeleteKeyframe = (time: number) => {
  if (!selectedElement) return;
  
  // Find the selected element
  const element = canvas.elements.find(el => el.id === selectedElement);
  if (!element || !element.timelineData) return;
  
  // Filter out the keyframe to delete
  const updatedKeyframes = element.timelineData.keyframes.filter(
    keyframe => keyframe.time !== time
  );
  
  // Update the element with the new keyframes array
  const updatedTimelineData = {
    ...element.timelineData,
    keyframes: updatedKeyframes
  };
  
  updateElement(selectedElement, { timelineData: updatedTimelineData });
};
```

## CSS Styling
```css
.keyframe-marker {
  position: absolute;
  width: 12px;
  height: 12px;
  transform: rotate(45deg) translateX(-50%);
  background-color: #F26D5B;
  border: 1px solid white;
  top: 50%;
  margin-top: -6px;
  cursor: pointer;
  z-index: 10;
  transition: transform 0.1s ease-in-out;
}

.keyframe-marker:hover {
  transform: rotate(45deg) translateX(-50%) scale(1.2);
}

.keyframe-connector {
  position: absolute;
  height: 2px;
  background-color: rgba(242, 109, 91, 0.5);
  top: 50%;
  z-index: 5;
}
```

## Testing Strategy
1. Test element selection and keyframe visibility
2. Test keyframe deletion from properties panel and timeline synchronization
3. Test multiple elements with different keyframes
4. Test edge cases (no keyframes, many keyframes, etc.)

## Next Steps
1. Implement the timeline keyframe visualization
2. Wire element selection to timeline keyframe display
3. Update delete logic to sync properties panel and timeline
4. Ensure one-to-one element-keyframe relationship
5. Test and validate against specifications
