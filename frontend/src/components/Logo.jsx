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
      >
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
        
        {/* Simplified Geometric Mark - Two overlapping bars for a modern "T" */}
        <rect 
          x="6" 
          y="6" 
          width="20" 
          height="5" 
          rx="2.5" 
          fill="url(#logo-gradient)" 
        />
        <rect 
          x="13.5" 
          y="6" 
          width="5" 
          height="20" 
          rx="2.5" 
          fill="url(#logo-gradient)" 
        />
        
        {/* Subtle dot to add character but keep it simple */}
        <circle cx="24" cy="24" r="2.5" fill="#8B5CF6" />
      </svg>
    </div>
  );
};

export default Logo;
