import React from 'react';

interface Position {
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;
}

interface GradientCircleProps {
  position?: Position;
  size?: number;
  colors?: [string, string];
  opacity?: number;
  blur?: number;
  zIndex?: number;
  animation?: boolean;
}

const GradientCircle: React.FC<GradientCircleProps> = ({ 
  position = { top: '50%', left: '50%' }, 
  size = 200, 
  colors = ['#3b82f6', '#1e40af'],
  opacity = 0.5,
  blur = 50,
  zIndex = -1,
  animation = true
}) => {
  // Create a positioned div that doesn't rely on transform for positioning
  // This is to avoid transform conflicts with animation
  const circleStyle: React.CSSProperties = {
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${colors[0]} 0%, ${colors[1]} 100%)`,
    opacity,
    filter: `blur(${blur}px)`,
    zIndex,
    ...position,
    // Adjust margin to account for centering
    marginTop: typeof position.top === 'string' ? 0 : -size/2,
    marginLeft: typeof position.left === 'string' ? 0 : -size/2,
    marginRight: typeof position.right === 'string' ? 0 : -size/2,
    marginBottom: typeof position.bottom === 'string' ? 0 : -size/2,
    // Remove transform that might conflict with animation
    transform: 'none',
    transition: 'all 0.3s ease',
  };

  return (
    <div style={circleStyle} className="gradient-circle">
      <style jsx>{`
        .gradient-circle {
          animation: ${animation ? 'float 10s infinite ease-in-out' : 'none'};
        }
        
        @keyframes float {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default GradientCircle;