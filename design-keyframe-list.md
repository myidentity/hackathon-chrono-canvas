# Keyframe List UI Design

## Overview
The keyframe list will be added to the PropertyPanel component to display all keyframes for the selected element. Each keyframe entry will show its timestamp and include a delete button.

## UI Components

### Keyframe List Section
- Section title: "Keyframes"
- Located below the existing properties in the panel
- Collapsible section (optional)
- Empty state message when no keyframes exist

### Keyframe Entry
- Displays timestamp in seconds (e.g., "2.5s")
- Shows a small diamond icon matching the timeline marker style
- Includes a delete button (trash icon)
- Highlights the current keyframe if it matches the timeline position

### Styling
- Consistent with existing PropertyPanel UI
- Uses the same color scheme and spacing
- Responsive to panel width
- Scrollable if many keyframes exist

## Functionality
- Clicking on a keyframe entry will navigate the timeline to that position
- Delete button removes the keyframe from the element
- List automatically updates when keyframes are added or removed
- Sorted by timestamp (ascending)

## Implementation Approach
1. Add a new section to the PropertyPanel component
2. Extract keyframes from the selected element's timelineData
3. Render each keyframe with timestamp and delete button
4. Implement delete functionality
5. Ensure the list updates reactively

## Technical Considerations
- Use the existing TimelineContext for timeline operations
- Leverage the CanvasContext for element updates
- Follow the existing UI component patterns and styling
