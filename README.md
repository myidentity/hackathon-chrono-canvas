# ChronoCanvas

ChronoCanvas is a web application that combines a time-based moodboard with an interactive zine-like viewing experience. It allows users to create visual narratives by placing elements on a canvas and associating them with specific points on a timeline.

## Features

- **Time-based Moodboard**: Place elements on a canvas and associate them with specific timeline points
- **Interactive Zine Viewer**: Experience content through scroll-triggered animations
- **Multiple Content Types**: Add images, text, shapes, stickers, and media to your canvas
- **Sophisticated Animation System**: Create beautiful transitions and effects
- **Multiple Viewing Modes**: Timeline scrubbing, presentation mode, and scroll-triggered zine mode
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Technology Stack

- React
- TypeScript
- Framer Motion for animations
- Tailwind CSS for styling
- React DnD for drag-and-drop functionality
- Vite for building and development

## Project Structure

```
chrono-canvas/
├── public/             # Static assets
├── src/                # Source code
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # React components
│   ├── context/        # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── .gitignore          # Git ignore file
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── README.md           # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/myidentity/hackathon-chrono-canvas.git
   cd hackathon-chrono-canvas
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Development Workflow

This project follows a specific branching strategy:

- `main`: Stable, production-ready code
- `development`: Integration branch for features
- Feature branches: Created for each specific feature (e.g., `feature/timeline-component`)
- Hotfix branches: For urgent fixes from main

## License

This project is part of the Code Circuit Hackathon and is not licensed for public use.

## Acknowledgments

- Created for the Code Circuit Hackathon
- Inspired by visual trip moodboards and interactive zine viewers
