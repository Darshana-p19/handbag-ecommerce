import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/logo.jpeg';

function Logo({ className = '' }) {
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <img 
        src={logoImage} 
        alt="HandbagStore" 
        className="h-8 sm:h-10 md:h-12 w-auto object-contain"
        // h-8 on mobile, h-10 on tablet, h-12 on desktop
      />
    </Link>
  );
}

export default Logo;