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
        {/* Rounded square background similar to the image */}
        <rect 
          x="2" 
          y="2" 
          width="28" 
          height="28" 
          rx="8" 
          fill="#161922" 
          stroke="#1F2328"
          strokeWidth="1"
        />
        
        {/* Horizontal Top Bar */}
        <rect 
          x="8" 
          y="9" 
          width="16" 
          height="3.5" 
          rx="1.75" 
          fill="white" 
        />
        
        {/* Vertical Stem - Segment 1 (Short) */}
        <rect 
          x="14.25" 
          y="13.5" 
          width="3.5" 
          height="5" 
          rx="1.75" 
          fill="white" 
        />
        
        {/* Vertical Stem - Segment 2 (Longer) */}
        <rect 
          x="14.25" 
          y="19.5" 
          width="3.5" 
          height="7" 
          rx="1.75" 
          fill="white" 
        />
      </svg>
    </div>
  );
};

export default Logo;
