# ChronoCanvas User Guide

## Introduction

ChronoCanvas is an interactive web application that combines a time-based moodboard with zine-like viewing capabilities. This guide will walk you through how to use the application, what to expect, and how to troubleshoot common issues.

## Getting Started

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/myidentity/hackathon-chrono-canvas.git
   cd hackathon-chrono-canvas
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   
   > **Troubleshooting**: If you encounter any errors during installation, try:
   > - Clearing npm cache: `npm cache clean --force`
   > - Using Node.js version 16 or higher
   > - Checking for any error messages about missing dependencies

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   
   > **Troubleshooting**: If the server fails to start:
   > - Check if port 5173 is already in use (try a different port with `npm run dev -- --port 3000`)
   > - Ensure all configuration files are using ES module syntax (export default) if package.json has "type": "module"
   > - Verify that index.html exists in the project root

4. **Access the application**:
   Open your browser and navigate to:
   ```
   http://localhost:5173/hackathon-chrono-canvas/
   ```

## What to Expect

When you first open ChronoCanvas, you should see:

1. **Header Bar**: Contains the ChronoCanvas logo, view mode tabs, and utility buttons
2. **Left Sidebar**: Element library with categories (Images, Text, Shapes, Stickers, Media)
3. **Main Canvas**: Central area where elements are placed and manipulated
4. **Right Sidebar**: Property panel for editing selected elements
5. **Timeline**: Bottom panel with playback controls and time indicators

If any of these components are missing or the application appears broken, see the Troubleshooting section below.

## Basic Usage

### 1. Adding Elements to Canvas

1. Click on a category in the Element Library (left sidebar)
2. Select an element from the displayed options
3. The element will appear on the canvas
4. Click and drag to position the element

> **Expected Behavior**: When you click on an element in the library, it should appear on the canvas. You should be able to select, move, and resize it.

### 2. Editing Elements

1. Click on an element on the canvas to select it
2. Use the Property Panel (right sidebar) to modify:
   - Position and size
   - Color and opacity
   - Text content (for text elements)
   - Timeline settings

> **Expected Behavior**: When an element is selected, it should show a highlight border and resize handles. The Property Panel should display options relevant to the selected element type.

### 3. Using the Timeline

1. Use the timeline scrubber at the bottom to move through time
2. Click the Play button to animate elements based on their timeline settings
3. Add markers at important points by clicking "Add Marker"
4. Change playback speed using the speed buttons (0.5x, 1x, 1.5x, 2x)

> **Expected Behavior**: The timeline should show a scrubber that can be dragged. When playing, elements should appear and disappear based on their entry and exit points.

### 4. Switching View Modes

Use the tabs in the header to switch between:

1. **Editor**: Default mode for creating and editing content
2. **Timeline**: Focus on timeline-based editing
3. **Zine View**: Scroll-triggered viewing experience
4. **Presentation**: Full-screen presentation mode

> **Expected Behavior**: The interface should update to reflect the selected mode. In Zine View, scrolling should trigger animations.

## Troubleshooting

### Application Doesn't Load

1. **Check Console for Errors**:
   - Open browser developer tools (F12 or right-click > Inspect)
   - Look for error messages in the Console tab

2. **Verify Build Configuration**:
   - Ensure index.html exists in the project root
   - Check that postcss.config.js and tailwind.config.js use ES module syntax if package.json has "type": "module"
   - Verify that all dependencies are installed, including terser

3. **Try a Clean Install**:
   ```bash
   rm -rf node_modules
   npm cache clean --force
   npm install
   ```

### Elements Don't Appear on Canvas

1. **Check Element Library**:
   - Verify that sample elements are visible in the left sidebar
   - Try clicking different categories (Images, Text, Shapes)

2. **Check Canvas Zoom**:
   - Use the zoom controls to reset zoom level
   - Try the "Reset Zoom" button

### Timeline Controls Don't Work

1. **Verify Timeline Initialization**:
   - Check if the timeline shows the correct time display (00:00 / 01:00)
   - Try clicking directly on the timeline to position the scrubber

2. **Test Play Button**:
   - Click the Play button to start playback
   - Verify that the button changes to Pause
   - Check if the time counter advances

### Visual Issues

1. **Style Problems**:
   - Verify that Tailwind CSS is properly loaded
   - Check if the application has the expected styling and layout

2. **Animation Issues**:
   - Ensure Framer Motion is properly installed
   - Try different view modes to test animations

## Expected Visual Reference

When properly loaded, ChronoCanvas should look similar to this:

1. **Editor Mode**: A grid-based canvas with element library on the left, property panel on the right, and timeline at the bottom
2. **Timeline Mode**: Focus on the timeline with larger scrubber and more detailed controls
3. **Zine View**: Full-screen scrollable view with elements appearing based on scroll position
4. **Presentation Mode**: Clean view without editing controls, focused on content presentation

## Getting Help

If you continue to experience issues:

1. Check the GitHub repository for any recent updates or known issues
2. Verify your Node.js and npm versions are compatible
3. Try running the application in a different browser
4. Check for any console errors and search for solutions online

## Conclusion

ChronoCanvas is designed to be an intuitive tool for creating time-based visual narratives. If you're experiencing issues, the most common problems are related to configuration, dependencies, or browser compatibility. Following the troubleshooting steps above should help resolve most issues.

If you need further assistance, please provide specific error messages or screenshots of what you're seeing to help diagnose the problem.
