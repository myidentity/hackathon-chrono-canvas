import React from 'react';

// Material Design 3 shape definitions
const MD3Shapes = [
  {
    id: 'md3-square',
    name: 'Square',
    svg: `<svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect x="2" y="2" width="20" height="20" fill="currentColor" />
    </svg>`
  },
  {
    id: 'md3-circle',
    name: 'Circle',
    svg: `<svg viewBox="0 0 24 24" width="100%" height="100%">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
    </svg>`
  },
  {
    id: 'md3-triangle',
    name: 'Triangle',
    svg: `<svg viewBox="0 0 24 24" width="100%" height="100%">
      <polygon points="12,2 22,22 2,22" fill="currentColor" />
    </svg>`
  },
  {
    id: 'md3-diamond',
    name: 'Diamond',
    svg: `<svg viewBox="0 0 24 24" width="100%" height="100%">
      <polygon points="12,2 22,12 12,22 2,12" fill="currentColor" />
    </svg>`
  },
  {
    id: 'md3-pentagon',
    name: 'Pentagon',
    svg: `<svg viewBox="0 0 24 24" width="100%" height="100%">
      <polygon points="12,2 22,8.5 19,20 5,20 2,8.5" fill="currentColor" />
    </svg>`
  },
  {
    id: 'md3-hexagon',
    name: 'Hexagon',
    svg: `<svg viewBox="0 0 24 24" width="100%" height="100%">
      <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill="currentColor" />
    </svg>`
  },
  {
    id: 'md3-octagon',
    name: 'Octagon',
    svg: `<svg viewBox="0 0 24 24" width="100%" height="100%">
      <polygon points="7,2 17,2 22,7 22,17 17,22 7,22 2,17 2,7" fill="currentColor" />
    </svg>`
  },
  {
    id: 'md3-star',
    name: 'Star',
    svg: `<svg viewBox="0 0 24 24" width="100%" height="100%">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="currentColor" />
    </svg>`
  },
  {
    id: 'md3-heart',
    name: 'Heart',
    svg: `<svg viewBox="0 0 24 24" width="100%" height="100%">
      <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" fill="currentColor" />
    </svg>`
  },
  {
    id: 'md3-rounded-rect',
    name: 'Rounded Rectangle',
    svg: `<svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect x="2" y="4" width="20" height="16" rx="4" ry="4" fill="currentColor" />
    </svg>`
  },
  {
    id: 'md3-pill',
    name: 'Pill',
    svg: `<svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect x="2" y="6" width="20" height="12" rx="6" ry="6" fill="currentColor" />
    </svg>`
  },
  {
    id: 'md3-oval',
    name: 'Oval',
    svg: `<svg viewBox="0 0 24 24" width="100%" height="100%">
      <ellipse cx="12" cy="12" rx="10" ry="7" fill="currentColor" />
    </svg>`
  },
  {
    id: 'md3-parallelogram',
    name: 'Parallelogram',
    svg: `<svg viewBox="0 0 24 24" width="100%" height="100%">
      <polygon points="6,4 22,4 18,20 2,20" fill="currentColor" />
    </svg>`
  },
  {
    id: 'md3-trapezoid',
    name: 'Trapezoid',
    svg: `<svg viewBox="0 0 24 24" width="100%" height="100%">
      <polygon points="4,20 20,20 16,4 8,4" fill="currentColor" />
    </svg>`
  },
  {
    id: 'md3-arrow',
    name: 'Arrow',
    svg: `<svg viewBox="0 0 24 24" width="100%" height="100%">
      <polygon points="2,12 8,6 8,9 22,9 22,15 8,15 8,18" fill="currentColor" />
    </svg>`
  }
];

export default MD3Shapes;
