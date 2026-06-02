import React, { useEffect } from 'react';

interface SkySplashProps {
  onComplete: () => void;
}

export default function SkySplash({ onComplete }: SkySplashProps) {
  useEffect(() => {
    // Set a timer to match the length of the CSS animation (3.5 seconds)
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#ffffff', // Clean white background for the logo
      overflow: 'hidden'
    }}>
      {/* Injecting CSS Keyframes for a smooth entrance and exit */}
      <style>
        {`
          @keyframes skyIntro {
            0% { 
              opacity: 0; 
              transform: scale(0.6) translateY(40px); 
            }
            30% { 
              opacity: 1; 
              transform: scale(1.05) translateY(-10px); 
            }
            50% { 
              opacity: 1; 
              transform: scale(1) translateY(0); 
            }
            80% { 
              opacity: 1; 
              transform: scale(1) translateY(0); 
            }
            100% { 
              opacity: 0; 
              transform: scale(1.3); 
            }
          }
          .sky-logo-anim {
            animation: skyIntro 3.5s ease-in-out forwards;
            max-width: 400px;
            width: 100%;
            border-radius: 20px; /* Optional: in case the image has sharp edges */
          }
        `}
      </style>
      
      {/* Displaying your logo with the animation class */}
      <img 
        src="image_9a6e57.jpg" 
        alt="SkyOs Logo" 
        className="sky-logo-anim"
      />
    </div>
  );
}