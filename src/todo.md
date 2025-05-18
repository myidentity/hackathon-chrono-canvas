# ChronoCanvas Debugging Tasks

## Selection and Dragging Functionality
- [x] Investigate selection event handling in element components
- [x] Fix selection event propagation in element components
- [x] Implement console logging for selection debugging
- [x] Fix element dragging to allow independent movement of selected elements
- [x] Validate property panel updates on selection
- [ ] Test adding multiple elements and selection

## Animation and Timeline Functionality
- [x] Fix TimelineContext infinite loop by using React refs
- [x] Fix missing useRef import in TimelineContext
- [x] Fix keyframe interpolation logic typo
- [ ] Test keyframes and animations across all views (editor, timeline, zine, presentation)
- [ ] Verify vertical scrolling in zine view

## Shape Rendering
- [x] Fix shape rendering by adding SVG assignment in ToolsPalette
- [x] Ensure proper SVG markup is present in element data
- [ ] Test all shape types render correctly

## UI Improvements
- [x] Remove labels below images in the image panel
- [ ] Verify media panel contains audio files and Thailand maps

## README Feature Testing
- [ ] Test Editor Mode features (element placement, selection, properties panel)
- [ ] Test Timeline Mode features (keyframes, animations, playback controls)
- [ ] Test Zine View Mode features (scroll-triggered animations, vertical layout)
- [ ] Test Presentation Mode features (clean view, playback controls)
- [ ] Test theme switching (light, dark, system)
- [ ] Test image upload and drag-and-drop functionality
- [ ] Test responsive design on different viewport sizes

## Final Testing
- [ ] Comprehensive testing of all fixed features
- [ ] Report and send test summary to user
