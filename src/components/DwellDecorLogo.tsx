import React from 'react';

interface DwellDecorLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light' | 'pink';
  showTagline?: boolean;
  className?: string;
}

export const DwellDecorLogo: React.FC<DwellDecorLogoProps> = ({
  size = 'md',
  variant = 'dark',
  showTagline = true,
  className = ''
}) => {
  // Compact, non-overbearing dimensions for scalable UI placement
  const svgDimensions = {
    sm: { width: 110, height: 38 },
    md: { width: 145, height: 50 },
    lg: { width: 190, height: 66 },
    xl: { width: 240, height: 84 }
  }[size];

  // Palette matching reference image:
  // - Dusty rose pink for bow, text & flowers: #C87D8C / #D88A9A
  // - Dark variant: #2D2123 text, #C57B8A accents
  // - Light variant: #FFFFFF text, #FCE3E8 accents
  const roseColor = variant === 'light' ? '#FCE3E8' : variant === 'pink' ? '#B84D63' : '#C87D8C';
  const textColor = variant === 'light' ? '#FFFFFF' : variant === 'pink' ? '#A83B52' : '#C37887';
  const subTextColor = variant === 'light' ? '#FADDE3' : variant === 'pink' ? '#8C2B40' : '#8A5863';
  const lineStroke = variant === 'light' ? 'rgba(255, 255, 255, 0.75)' : variant === 'pink' ? '#E098A6' : '#DC9AA7';

  return (
    <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
      <svg
        width={svgDimensions.width}
        height={svgDimensions.height}
        viewBox="0 0 280 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-auto h-auto max-w-full"
      >
        {/* Top Accent: Ribbon Bow */}
        <g id="top-bow-accent" transform="translate(140, 15)">
          {/* Left Loop */}
          <path
            d="M 0 0 C -8 -10 -24 -8 -22 1 C -20 9 -6 4 0 0 Z"
            fill={roseColor}
          />
          {/* Right Loop */}
          <path
            d="M 0 0 C 8 -10 24 -8 22 1 C 20 9 6 4 0 0 Z"
            fill={roseColor}
          />
          {/* Left Ribbon Tail */}
          <path
            d="M -3 2 C -8 6 -12 12 -15 14 C -13 14 -8 10 -2 3 Z"
            fill={roseColor}
            opacity="0.85"
          />
          {/* Right Ribbon Tail */}
          <path
            d="M 3 2 C 8 6 12 12 15 14 C 13 14 8 10 2 3 Z"
            fill={roseColor}
            opacity="0.85"
          />
          {/* Center Knot */}
          <ellipse cx="0" cy="0.5" rx="3.5" ry="3" fill={variant === 'light' ? '#FFFFFF' : '#A85B6A'} />
        </g>

        {/* Brand Name Text: Dwell & Decor */}
        <text
          x="140"
          y="46"
          textAnchor="middle"
          fill={textColor}
          fontSize="33"
          fontWeight="400"
          fontFamily="'Great Vibes', 'Alex Brush', 'Playfair Display', cursive"
          letterSpacing="0.5"
        >
          Dwell &amp; Decor
        </text>

        {/* Divider Line with Floral Endpoints */}
        <g id="divider-with-flowers">
          {/* Left Flower Accent */}
          <g id="left-flower" transform="translate(68, 62)">
            <circle cx="0" cy="-3.2" r="2.2" fill={roseColor} />
            <circle cx="0" cy="3.2" r="2.2" fill={roseColor} />
            <circle cx="-3.2" cy="0" r="2.2" fill={roseColor} />
            <circle cx="3.2" cy="0" r="2.2" fill={roseColor} />
            <circle cx="0" cy="0" r="1.5" fill={variant === 'light' ? '#FFFFFF' : '#FCEBF0'} />
          </g>

          {/* Center Line */}
          <line
            x1="76"
            y1="62"
            x2="204"
            y2="62"
            stroke={lineStroke}
            strokeWidth="1.1"
            strokeLinecap="round"
          />

          {/* Right Flower Accent */}
          <g id="right-flower" transform="translate(212, 62)">
            <circle cx="0" cy="-3.2" r="2.2" fill={roseColor} />
            <circle cx="0" cy="3.2" r="2.2" fill={roseColor} />
            <circle cx="-3.2" cy="0" r="2.2" fill={roseColor} />
            <circle cx="3.2" cy="0" r="2.2" fill={roseColor} />
            <circle cx="0" cy="0" r="1.5" fill={variant === 'light' ? '#FFFFFF' : '#FCEBF0'} />
          </g>
        </g>

        {/* Subtitle Tagline: styled with love */}
        {showTagline && (
          <text
            x="140"
            y="85"
            textAnchor="middle"
            fill={subTextColor}
            fontSize="15"
            fontStyle="italic"
            fontWeight="400"
            fontFamily="'Alex Brush', 'Playfair Display', 'Dancing Script', cursive, serif"
            letterSpacing="0.6"
          >
            styled with love
          </text>
        )}
      </svg>
    </div>
  );
};




