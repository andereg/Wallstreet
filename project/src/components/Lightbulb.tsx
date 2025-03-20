import React, { useState, useEffect } from 'react';

const PremiumLightbulbLoader = () => {
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [isIdea, setIsIdea] = useState(false);
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    // Glow animation
    const glowInterval = setInterval(() => {
      setGlowIntensity(prev => {
        const newValue = prev + 0.01;
        // When reaching full intensity, trigger the "idea moment"
        if (newValue >= 1 && !isIdea) {
          setIsIdea(true);
          createParticles();
        }
        return newValue > 1 ? 1 : newValue;
      });
    }, 30);
    
    return () => clearInterval(glowInterval);
  }, [isIdea]);
  
  // Create particles when the lightbulb reaches full brightness
  const createParticles = () => {
    const newParticles = [];
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        size: Math.random() * 6 + 2,
        speed: Math.random() * 2 + 1
      });
    }
    setParticles(newParticles);
  };

  return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="relative">
        {/* Particles (stars) */}
        {isIdea && particles.map(particle => (
          <div 
            key={particle.id}
            className="absolute rounded-full bg-yellow-200" 
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${60 + particle.x}px`,
              top: `${45 + particle.y}px`,
              opacity: 0.8,
              boxShadow: '0 0 6px 2px rgba(255, 255, 200, 0.8)',
              animation: `moveOut ${particle.speed}s ease-out forwards`
            }}
          />
        ))}
        
        <svg width="140" height="180" viewBox="0 0 140 180">
          {/* Enhanced filters and effects */}
          <defs>
            <filter id="bulbGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={8 * glowIntensity} result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            <radialGradient id="enhancedBulbGradient" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor={`rgba(255, 255, 200, ${glowIntensity * 0.9 + 0.1})`} />
              <stop offset="40%" stopColor={`rgba(255, 255, 100, ${glowIntensity * 0.8})`} />
              <stop offset="100%" stopColor={`rgba(255, 200, 0, ${glowIntensity * 0.7})`} />
            </radialGradient>
            
            <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#AAA" />
              <stop offset="50%" stopColor="#888" />
              <stop offset="100%" stopColor="#666" />
            </linearGradient>
            
            <filter id="innerShadow">
              <feOffset dx="0" dy="2" />
              <feGaussianBlur stdDeviation="2" result="offset-blur" />
              <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
              <feFlood floodColor="black" floodOpacity="0.4" result="color" />
              <feComposite operator="in" in="color" in2="inverse" result="shadow" />
              <feComposite operator="over" in="shadow" in2="SourceGraphic" />
            </filter>
          </defs>
          
          {/* Background glow */}
          <circle 
            cx="70" 
            cy="50" 
            r="45" 
            fill={`rgba(255, 255, 150, ${glowIntensity * 0.3})`} 
            filter="url(#bulbGlow)" 
          />
          
          {/* Light rays - more dynamic with varying stroke width */}
          <g style={{ opacity: glowIntensity, filter: 'url(#bulbGlow)' }}>
            <line x1="70" y1="5" x2="70" y2="-8" stroke="yellow" strokeWidth="2" />
            <line x1="100" y1="20" x2="115" y2="5" stroke="yellow" strokeWidth="3" />
            <line x1="115" y1="50" x2="130" y2="50" stroke="yellow" strokeWidth="2" />
            <line x1="100" y1="80" x2="115" y2="95" stroke="yellow" strokeWidth="1.5" />
            <line x1="40" y1="80" x2="25" y2="95" stroke="yellow" strokeWidth="2.5" />
            <line x1="25" y1="50" x2="10" y2="50" stroke="yellow" strokeWidth="2" />
            <line x1="40" y1="20" x2="25" y2="5" stroke="yellow" strokeWidth="1.5" />
          </g>
          
          {/* Filament */}
          <path 
            d="M55 50 C60 30, 80 30, 85 50" 
            stroke={`rgba(255, 100, 0, ${glowIntensity})`} 
            strokeWidth="2" 
            fill="none" 
            filter={`url(#bulbGlow)`}
          />
          
          {/* Main bulb with enhanced gradient */}
          <circle 
            cx="70" 
            cy="50" 
            r="35" 
            fill="url(#enhancedBulbGradient)" 
            stroke="#888" 
            strokeWidth="3" 
            filter={isIdea ? "url(#bulbGlow)" : "none"}
          />
          
          {/* Glass reflections - more realistic */}
          <ellipse 
            cx="55" 
            cy="35" 
            rx="10" 
            ry="15" 
            fill={`rgba(255, 255, 255, ${glowIntensity * 0.7})`} 
            style={{ mixBlendMode: 'screen' }}
          />
          <ellipse 
            cx="85" 
            cy="60" 
            rx="5" 
            ry="8" 
            fill={`rgba(255, 255, 255, ${glowIntensity * 0.5})`} 
            style={{ mixBlendMode: 'screen' }}
          />
          
          {/* Base with metallic look */}
          <path 
            d="M55 85 L55 95 C55 110, 85 110, 85 95 L85 85 Z" 
            fill="url(#metalGradient)" 
            stroke="#666" 
            strokeWidth="2" 
            filter="url(#innerShadow)"
          />
          
          {/* Screw base with better definition */}
          <path 
            d="M58 95 L58 120 C58 125, 82 125, 82 120 L82 95 Z" 
            fill="url(#metalGradient)" 
            stroke="#777" 
            strokeWidth="2" 
            filter="url(#innerShadow)"
          />
          <path 
            d="M58 120 L58 130 C58 135, 82 135, 82 130 L82 120 Z" 
            fill="#888" 
            stroke="#777" 
            strokeWidth="2" 
            filter="url(#innerShadow)"
          />
          <path 
            d="M62 130 L62 140 C62 145, 78 145, 78 140 L78 130 Z" 
            fill="#777" 
            stroke="#666" 
            strokeWidth="1" 
            filter="url(#innerShadow)"
          />
          
          {/* Connected wires */}
          <path 
            d="M62 145 L62 155 C62 155, 55 160, 55 165" 
            stroke="#222" 
            strokeWidth="2" 
            fill="none" 
          />
          <path 
            d="M78 145 L78 155 C78 155, 85 160, 85 165" 
            stroke="#222" 
            strokeWidth="2" 
            fill="none" 
          />
        </svg>
        
        {/* Enhanced reflection */}
        <div 
          className="absolute left-0 bottom-0 w-full"
          style={{ 
            height: '60px',
            background: `radial-gradient(ellipse at center, rgba(255, 255, 100, ${glowIntensity * 0.6}) 0%, rgba(255, 255, 100, 0) 70%)`,
            transform: 'translateY(100%)',
            opacity: glowIntensity
          }}
        />
      </div>
      
      {/* Message that transforms */}
      <div className="mt-8 text-center font-medium text-lg" style={{ 
        opacity: glowIntensity,
        color: isIdea ? '#FFD700' : '#666',
        textShadow: isIdea ? '0 0 10px rgba(255, 215, 0, 0.7)' : 'none',
        fontWeight: isIdea ? 'bold' : 'normal',
        transform: isIdea ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.3s ease'
      }}>
        {isIdea ? 'Brilliant Idea Found!' : 'LET ME COOK...'}
      </div>

      {/* Custom CSS for particle animation */}
      <style jsx>{`
        @keyframes moveOut {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default PremiumLightbulbLoader;