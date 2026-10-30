import React from 'react';

interface MedevacLogoProps {
  size?: number;
  showText?: boolean;
  textColor?: string;
  className?: string;
}

export const MedevacLogo: React.FC<MedevacLogoProps> = ({
  size = 40,
  showText = false,
  textColor = '#ffffff',
  className = '',
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size > 40 ? 12 : 8,
        userSelect: 'none',
      }}
    >
      {/* Dynamic Winged Shield & Star of Life Vector */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'drop-shadow(0 4px 10px rgba(0, 210, 255, 0.35))',
          flexShrink: 0,
        }}
      >
        <defs>
          {/* Main Shield Gradient */}
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f2027" />
            <stop offset="50%" stopColor="#203a43" />
            <stop offset="100%" stopColor="#2c5364" />
          </linearGradient>

          {/* Golden / Neon Border Gradient */}
          <linearGradient id="neonBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d2ff" />
            <stop offset="50%" stopColor="#3a7bd5" />
            <stop offset="100%" stopColor="#ff4d4f" />
          </linearGradient>

          {/* Emergency Cross Red Gradient */}
          <linearGradient id="emergencyCross" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff4d4f" />
            <stop offset="100%" stopColor="#d91b2c" />
          </linearGradient>

          {/* Wings Cyan Gradient */}
          <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="100%" stopColor="#4facfe" />
          </linearGradient>
        </defs>

        {/* Outer Glow Halo */}
        <circle cx="60" cy="60" r="54" fill="url(#wingGrad)" opacity="0.12" />

        {/* Tactical Shield Body */}
        <path
          d="M60 8 L98 22 C98 55 86 88 60 110 C34 88 22 55 22 22 L60 8 Z"
          fill="url(#shieldGrad)"
          stroke="url(#neonBorder)"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Dynamic Evacuation Wings - Left */}
        <path
          d="M10 42 C24 38 42 46 50 56 C38 58 24 54 14 62 C22 66 32 68 44 68 C32 74 20 78 12 84 C26 84 40 80 52 74"
          stroke="url(#wingGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />

        {/* Dynamic Evacuation Wings - Right */}
        <path
          d="M110 42 C96 38 78 46 70 56 C82 58 96 54 106 62 C98 66 88 68 76 68 C88 74 100 78 108 84 C94 84 80 80 68 74"
          stroke="url(#wingGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />

        {/* Medical Evacuation Cross (Red & White) */}
        <g transform="translate(60, 58)">
          {/* White Border Behind Cross */}
          <path
            d="M-8 -26 H8 V-8 H26 V8 H8 V26 H-8 V8 H-26 V-8 H-8 Z"
            fill="#ffffff"
          />
          {/* Inner Emergency Red Cross */}
          <path
            d="M-6 -24 H6 V-6 H24 V6 H6 V24 H-6 V6 H-24 V-6 H-6 Z"
            fill="url(#emergencyCross)"
          />
        </g>

        {/* Central Pulse / Star of Life Vital Dot */}
        <circle cx="60" cy="58" r="3.5" fill="#ffffff" />
        <circle cx="60" cy="58" r="2" fill="#00d2ff" />

        {/* Golden Base Star */}
        <polygon
          points="60,94 62,99 67,99 63,102 65,107 60,104 55,107 57,102 53,99 58,99"
          fill="#ffd700"
        />
      </svg>

      {/* Optional Typography */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span
            style={{
              fontSize: size > 40 ? 18 : 15,
              fontWeight: 900,
              letterSpacing: '1px',
              color: textColor,
              textTransform: 'uppercase',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            MEDEVAC <span style={{ color: '#00d2ff' }}>TEAM</span>
          </span>
          <span
            style={{
              fontSize: size > 40 ? 11 : 10,
              color: 'rgba(255, 255, 255, 0.65)',
              fontWeight: 500,
              letterSpacing: '0.5px',
            }}
          >
            فريق الإخلاء الطبي والرعاية الفائقة
          </span>
        </div>
      )}
    </div>
  );
};
