# ChronoCanvas - Build and Configuration Guide

## Overview

This document provides instructions for building and running ChronoCanvas, addressing the configuration issues that were fixed in the latest update.

## Fixed Issues

1. **ES Module Compatibility**: 
   - Converted PostCSS and Tailwind config files to ES module syntax to match the `"type": "module"` setting in package.json
   - Ensures compatibility with modern Node.js ES module system

2. **Missing Index.html**:
   - Added the required index.html file in the project root
   - Configured with proper entry points and meta tags

3. **Missing Dependencies**:
   - Added terser as a dev dependency for production builds
   - Ensures proper minification during the build process

## Build Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Development Server**:
   ```bash
   npm run dev
   ```
   This will start the development server at http://localhost:5173/hackathon-chrono-canvas/

3. **Production Build**:
   ```bash
   npm run build
   ```
   This will create optimized production files in the `dist` directory.

4. **Preview Production Build**:
   ```bash
   npm run preview
   ```
   This will serve the production build locally for testing.

## Deployment

The application is configured for GitHub Pages deployment with the base path `/hackathon-chrono-canvas/`. To deploy:

```bash
npm run deploy
```

This will build the application and deploy it to the gh-pages branch of your repository.

## Troubleshooting

If you encounter any issues:

1. **Module Syntax Errors**:
   - Ensure all config files use ES module syntax (export default) instead of CommonJS (module.exports)
   - Check that package.json has `"type": "module"`

2. **Build Failures**:
   - Verify that terser is installed (`npm install --save-dev terser`)
   - Check that index.html exists in the project root

3. **Path Issues**:
   - Verify that the base path in vite.config.ts matches your GitHub repository name
