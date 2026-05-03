import React from 'react';

const Logo = ({ size = 28, className = "" }) => {
  return (
    <div 
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]"
      >
        {/* Abstract "T" / Tracking Path Mark */}
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Outer Ring / Aura */}
        <circle 
          cx="16" 
          cy="16" 
          r="15" 
          stroke="url(#logo-gradient)" 
          strokeWidth="0.5" 
          strokeOpacity="0.3" 
        />
        
        {/* Main Logo Mark */}
        <path
          d="M8 8H24V12H18V24H14V12H8V8Z"
          fill="url(#logo-gradient)"
          filter="url(#glow)"
        />
        
        {/* Dynamic Accent / Tracking Mark */}
        <path
          d="M22 22L26 26"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          className="animate-pulse"
        />
        <circle cx="26" cy="26" r="1.5" fill="white" />
      </svg>
    </div>
  );
};

export default Logo;
