import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrajectoryService } from '../services/trajectoryService';

interface HitAreaDebugProps {
  enabled: boolean;
  showDimensions?: boolean;
}

export function HitAreaDebug({ enabled, showDimensions = true }: HitAreaDebugProps) {
  const [dimensions, setDimensions] = useState({
    width: 240,
    height: 240,
    radius: 120,
    hitRadius: 108,
    scatterRange: 28.8
  });

  // Update dimensions when component mounts and on resize
  useEffect(() => {
    const updateDimensions = () => {
      const newDimensions = TrajectoryService.getTableDimensions();
      setDimensions(newDimensions);
    };

    if (enabled) {
      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      
      // Also update when table becomes available (in case of initial load)
      const interval = setInterval(() => {
        const tableBg = document.querySelector('.table-background');
        if (tableBg) {
          updateDimensions();
          clearInterval(interval);
        }
      }, 100);

      return () => {
        window.removeEventListener('resize', updateDimensions);
        clearInterval(interval);
      };
    }
  }, [enabled]);

  if (!enabled) return null;

  const hitAreaDiameter = dimensions.hitRadius * 2;
  const scatterAreaDiameter = dimensions.scatterRange * 2;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 50 }}>
      {/* Debug indicator - bright green box to confirm component is rendering */}
      <div 
        className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded border-2 border-white"
        style={{ zIndex: 100 }}
      />
      
      {/* Hit Area Circle - 90% of table radius */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        exit={{ scale: 0, opacity: 0 }}
        className="absolute rounded-full border-4 border-green-400"
        style={{
          width: `${hitAreaDiameter}px`,
          height: `${hitAreaDiameter}px`,
          backgroundColor: 'rgba(34, 197, 94, 0.25)', // More visible green background
          boxShadow: 'inset 0 0 20px rgba(34, 197, 94, 0.4), 0 0 30px rgba(34, 197, 94, 0.6)',
          zIndex: 50,
        }}
      />

      {/* Scatter Range Circle - 30% of hit radius */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.7 }}
        exit={{ scale: 0, opacity: 0 }}
        className="absolute rounded-full border-2 border-green-300 border-dashed"
        style={{
          width: `${scatterAreaDiameter}px`,
          height: `${scatterAreaDiameter}px`,
          backgroundColor: 'rgba(34, 197, 94, 0.15)',
          zIndex: 51,
        }}
      />

      {/* Center point indicator */}
      <div 
        className="absolute w-4 h-4 bg-green-500 rounded-full"
        style={{
          boxShadow: '0 0 16px rgba(34, 197, 94, 1)',
          zIndex: 52,
        }}
      />

      {/* Dimension Information */}
      {showDimensions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 bg-black/90 text-green-400 px-3 py-2 rounded text-xs font-mono whitespace-nowrap border-2 border-green-400"
          style={{ zIndex: 60 }}
        >
          <div className="space-y-1">
            <div>Table: {dimensions.width.toFixed(0)}×{dimensions.height.toFixed(0)}px (r:{dimensions.radius.toFixed(0)})</div>
            <div>Hit Area: {hitAreaDiameter.toFixed(0)}px (90% of table)</div>
            <div>Scatter: {scatterAreaDiameter.toFixed(0)}px (30% of hit area)</div>
          </div>
        </motion.div>
      )}

      {/* Grid lines for reference */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Horizontal line */}
        <div 
          className="absolute h-px bg-green-300 opacity-30"
          style={{ width: `${hitAreaDiameter}px` }}
        />
        {/* Vertical line */}
        <div 
          className="absolute w-px bg-green-300 opacity-30"
          style={{ height: `${hitAreaDiameter}px` }}
        />
      </div>

      {/* Radius indicators */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {/* Hit radius line */}
        <div 
          className="absolute top-0 left-0 origin-left bg-green-400 opacity-60"
          style={{
            width: `${dimensions.hitRadius}px`,
            height: '1px',
            transform: 'rotate(45deg)',
          }}
        />
        {/* Scatter radius line */}
        <div 
          className="absolute top-0 left-0 origin-left bg-green-300 opacity-60"
          style={{
            width: `${dimensions.scatterRange}px`,
            height: '1px',
            transform: 'rotate(-45deg)',
          }}
        />
      </div>
    </div>
  );
}