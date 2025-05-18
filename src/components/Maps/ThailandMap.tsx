import React from 'react';

interface ThailandMapProps {
  width?: number;
  height?: number;
}

const ThailandMap: React.FC<ThailandMapProps> = ({ width = 400, height = 600 }) => {
  // Define colors for different regions
  const northColor = '#8BC34A'; // Green
  const northeastColor = '#9C27B0'; // Purple
  const centralColor = '#FFC107'; // Amber
  const eastColor = '#E91E63'; // Pink
  const westColor = '#795548'; // Brown
  const southColor = '#03A9F4'; // Light Blue

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 600"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect x="0" y="0" width="400" height="600" fill="#f5f5f5" />
      
      {/* Map Title */}
      <text x="200" y="30" fontFamily="Arial" fontSize="20" fontWeight="bold" textAnchor="middle" fill="#FF9800">
        THAILAND TOURIST MAP
      </text>

      {/* Northern Region */}
      <path
        d="M150,100 L180,80 L220,90 L240,120 L220,150 L190,160 L160,150 L140,130 Z"
        fill={northColor}
        stroke="#333"
        strokeWidth="2"
      />
      <text x="190" y="120" fontFamily="Arial" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#333">
        CHIANG MAI
      </text>
      <circle cx="190" cy="120" r="5" fill="#f44336" />

      {/* Northeastern Region */}
      <path
        d="M240,120 L280,110 L300,130 L290,170 L260,190 L230,180 L220,150 Z"
        fill={northeastColor}
        stroke="#333"
        strokeWidth="2"
      />

      {/* Central Region */}
      <path
        d="M160,150 L190,160 L220,150 L230,180 L220,220 L190,240 L160,230 L150,200 Z"
        fill={centralColor}
        stroke="#333"
        strokeWidth="2"
      />
      <text x="190" y="200" fontFamily="Arial" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#333">
        BANGKOK
      </text>
      <circle cx="190" cy="200" r="5" fill="#f44336" />

      {/* Eastern Region */}
      <path
        d="M220,220 L260,190 L270,210 L260,240 L230,250 L210,240 Z"
        fill={eastColor}
        stroke="#333"
        strokeWidth="2"
      />
      <text x="240" y="220" fontFamily="Arial" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#333">
        PATTAYA
      </text>
      <circle cx="240" cy="220" r="5" fill="#f44336" />

      {/* Western Region */}
      <path
        d="M150,200 L160,230 L150,260 L120,270 L100,250 L110,220 L130,210 Z"
        fill={westColor}
        stroke="#333"
        strokeWidth="2"
      />

      {/* Southern Region - Upper */}
      <path
        d="M150,260 L190,240 L210,240 L230,250 L220,280 L200,300 L170,310 L150,290 Z"
        fill={southColor}
        stroke="#333"
        strokeWidth="2"
      />

      {/* Southern Region - Lower */}
      <path
        d="M170,310 L200,300 L210,320 L200,350 L210,380 L200,410 L180,440 L160,470 L150,500 L170,520 L160,540 L140,530 L130,500 L140,470 L130,440 L140,410 L150,380 L140,350 L150,320 Z"
        fill={southColor}
        stroke="#333"
        strokeWidth="2"
      />
      <text x="170" y="450" fontFamily="Arial" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#333">
        PHUKET
      </text>
      <circle cx="150" cy="470" r="5" fill="#f44336" />

      {/* Tourist Attractions */}
      {/* Temples */}
      <g transform="translate(190,180)">
        <path d="M0,-10 L10,0 L0,10 L-10,0 Z" fill="#FFD700" />
        <rect x="-5" y="0" width="10" height="10" fill="#FFD700" />
      </g>

      {/* Beach */}
      <g transform="translate(150,490)">
        <path d="M-10,0 Q-5,-5 0,0 Q5,-5 10,0" stroke="#FFD700" strokeWidth="2" fill="none" />
        <path d="M-10,3 Q-5,-2 0,3 Q5,-2 10,3" stroke="#FFD700" strokeWidth="2" fill="none" />
      </g>

      {/* Mountains */}
      <g transform="translate(190,100)">
        <path d="M-10,10 L0,0 L10,10" stroke="#795548" strokeWidth="2" fill="none" />
        <path d="M-5,10 L0,5 L5,10" stroke="#795548" strokeWidth="2" fill="none" />
      </g>

      {/* Elephant */}
      <g transform="translate(280,150)">
        <circle cx="0" cy="0" r="5" fill="#795548" />
        <path d="M0,-5 Q10,-10 10,0" stroke="#795548" strokeWidth="2" fill="none" />
      </g>

      {/* Boat */}
      <g transform="translate(220,350)">
        <path d="M-10,0 Q-5,5 0,0 Q5,5 10,0" stroke="#03A9F4" strokeWidth="2" fill="none" />
        <line x1="0" y1="0" x2="0" y2="-10" stroke="#795548" strokeWidth="2" />
      </g>

      {/* Palm Trees */}
      <g transform="translate(130,450)">
        <line x1="0" y1="0" x2="0" y2="10" stroke="#795548" strokeWidth="2" />
        <path d="M0,0 Q5,-5 10,-3 M0,0 Q-5,-5 -10,-3 M0,0 Q5,-10 3,-15 M0,0 Q-5,-10 -3,-15" stroke="#8BC34A" strokeWidth="1" fill="none" />
      </g>
      <g transform="translate(250,230)">
        <line x1="0" y1="0" x2="0" y2="10" stroke="#795548" strokeWidth="2" />
        <path d="M0,0 Q5,-5 10,-3 M0,0 Q-5,-5 -10,-3 M0,0 Q5,-10 3,-15 M0,0 Q-5,-10 -3,-15" stroke="#8BC34A" strokeWidth="1" fill="none" />
      </g>

      {/* Legend */}
      <rect x="50" y="540" width="300" height="50" fill="rgba(255,255,255,0.7)" rx="5" />
      
      <rect x="60" y="550" width="15" height="10" fill={northColor} stroke="#333" />
      <text x="85" y="558" fontFamily="Arial" fontSize="10" fill="#333">North</text>
      
      <rect x="120" y="550" width="15" height="10" fill={northeastColor} stroke="#333" />
      <text x="145" y="558" fontFamily="Arial" fontSize="10" fill="#333">Northeast</text>
      
      <rect x="200" y="550" width="15" height="10" fill={centralColor} stroke="#333" />
      <text x="225" y="558" fontFamily="Arial" fontSize="10" fill="#333">Central</text>
      
      <rect x="270" y="550" width="15" height="10" fill={eastColor} stroke="#333" />
      <text x="295" y="558" fontFamily="Arial" fontSize="10" fill="#333">East</text>
      
      <rect x="60" y="570" width="15" height="10" fill={westColor} stroke="#333" />
      <text x="85" y="578" fontFamily="Arial" fontSize="10" fill="#333">West</text>
      
      <rect x="120" y="570" width="15" height="10" fill={southColor} stroke="#333" />
      <text x="145" y="578" fontFamily="Arial" fontSize="10" fill="#333">South</text>
      
      <circle cx="200" cy="575" r="5" fill="#f44336" />
      <text x="215" y="578" fontFamily="Arial" fontSize="10" fill="#333">Tourist Spot</text>

      {/* Decorative elements */}
      <path d="M30,30 Q50,10 70,30 Q90,50 110,30" stroke="#03A9F4" strokeWidth="2" fill="none" />
      <path d="M290,30 Q310,10 330,30 Q350,50 370,30" stroke="#03A9F4" strokeWidth="2" fill="none" />
      
      <path d="M30,530 Q50,510 70,530 Q90,550 110,530" stroke="#03A9F4" strokeWidth="2" fill="none" />
      <path d="M290,530 Q310,510 330,530 Q350,550 370,530" stroke="#03A9F4" strokeWidth="2" fill="none" />
    </svg>
  );
};

export default ThailandMap;
