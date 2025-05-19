import React, { useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

interface FramerMotionTestProps {
  currentPosition: number;
  duration: number;
}

/**
 * A test component to validate Framer Motion for keyframe animation in ChronoCanvas
 */
const FramerMotionTest: React.FC<FramerMotionTestProps> = ({ 
  currentPosition,
  duration
}) => {
  const controls = useAnimation();
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Define keyframes for our test animation
  const keyframes = [
    { time: 0, x: 50, y: 50, rotate: 0, scale: 1, opacity: 1 },
    { time: 2, x: 300, y: 150, rotate: 45, scale: 1.5, opacity: 0.8 },
    { time: 5, x: 600, y: 50, rotate: 90, scale: 1, opacity: 1 }
  ];
  
  // Find the keyframes surrounding the current position
  const findSurroundingKeyframes = (position: number) => {
    const prevKeyframe = [...keyframes]
      .filter(kf => kf.time <= position)
      .sort((a, b) => b.time - a.time)[0];
    
    const nextKeyframe = [...keyframes]
      .filter(kf => kf.time > position)
      .sort((a, b) => a.time - b.time)[0];
    
    return { prevKeyframe, nextKeyframe };
  };
  
  // Update animation based on current timeline position
  React.useEffect(() => {
    const { prevKeyframe, nextKeyframe } = findSurroundingKeyframes(currentPosition);
    
    if (prevKeyframe && nextKeyframe) {
      // Calculate progress between keyframes (0-1)
      const progress = (currentPosition - prevKeyframe.time) / (nextKeyframe.time - prevKeyframe.time);
      
      // Interpolate values
      const x = prevKeyframe.x + (nextKeyframe.x - prevKeyframe.x) * progress;
      const y = prevKeyframe.y + (nextKeyframe.y - prevKeyframe.y) * progress;
      const rotate = prevKeyframe.rotate + (nextKeyframe.rotate - prevKeyframe.rotate) * progress;
      const scale = prevKeyframe.scale + (nextKeyframe.scale - prevKeyframe.scale) * progress;
      const opacity = prevKeyframe.opacity + (nextKeyframe.opacity - prevKeyframe.opacity) * progress;
      
      // Animate to the interpolated values immediately
      controls.start({
        x,
        y,
        rotate,
        scale,
        opacity,
        transition: { duration: 0 } // Immediate transition for scrubbing
      });
    } else if (prevKeyframe) {
      // After last keyframe - use last keyframe values
      controls.start({
        x: prevKeyframe.x,
        y: prevKeyframe.y,
        rotate: prevKeyframe.rotate,
        scale: prevKeyframe.scale,
        opacity: prevKeyframe.opacity,
        transition: { duration: 0 }
      });
    } else if (nextKeyframe) {
      // Before first keyframe - use first keyframe values
      controls.start({
        x: nextKeyframe.x,
        y: nextKeyframe.y,
        rotate: nextKeyframe.rotate,
        scale: nextKeyframe.scale,
        opacity: nextKeyframe.opacity,
        transition: { duration: 0 }
      });
    }
  }, [currentPosition, controls]);
  
  // Play animation from current position
  const playAnimation = () => {
    setIsPlaying(true);
    
    // Find all keyframes after current position
    const futureKeyframes = keyframes
      .filter(kf => kf.time > currentPosition)
      .sort((a, b) => a.time - b.time);
    
    // If no future keyframes, loop back to start
    if (futureKeyframes.length === 0) {
      controls.start({
        x: keyframes[0].x,
        y: keyframes[0].y,
        rotate: keyframes[0].rotate,
        scale: keyframes[0].scale,
        opacity: keyframes[0].opacity,
        transition: { 
          duration: 0.5,
          ease: "easeInOut"
        }
      });
      return;
    }
    
    // Animate through each future keyframe in sequence
    let sequence = [];
    
    // Start with current interpolated position
    const { prevKeyframe, nextKeyframe } = findSurroundingKeyframes(currentPosition);
    let startKeyframe;
    
    if (prevKeyframe && nextKeyframe) {
      // Calculate progress between keyframes (0-1)
      const progress = (currentPosition - prevKeyframe.time) / (nextKeyframe.time - prevKeyframe.time);
      
      // Interpolate values for starting point
      startKeyframe = {
        x: prevKeyframe.x + (nextKeyframe.x - prevKeyframe.x) * progress,
        y: prevKeyframe.y + (nextKeyframe.y - prevKeyframe.y) * progress,
        rotate: prevKeyframe.rotate + (nextKeyframe.rotate - prevKeyframe.rotate) * progress,
        scale: prevKeyframe.scale + (nextKeyframe.scale - prevKeyframe.scale) * progress,
        opacity: prevKeyframe.opacity + (nextKeyframe.opacity - prevKeyframe.opacity) * progress
      };
    } else if (prevKeyframe) {
      startKeyframe = prevKeyframe;
    } else if (nextKeyframe) {
      startKeyframe = nextKeyframe;
    } else {
      startKeyframe = keyframes[0];
    }
    
    // Add each future keyframe to the sequence
    futureKeyframes.forEach((kf, index) => {
      const prevKf = index === 0 ? startKeyframe : futureKeyframes[index - 1];
      const duration = index === 0 
        ? (kf.time - currentPosition) 
        : (kf.time - futureKeyframes[index - 1].time);
      
      sequence.push({
        x: kf.x,
        y: kf.y,
        rotate: kf.rotate,
        scale: kf.scale,
        opacity: kf.opacity,
        transition: { 
          duration: duration,
          ease: "easeInOut"
        }
      });
    });
    
    // Execute the animation sequence
    controls.start(sequence[0]);
  };
  
  // Stop animation
  const stopAnimation = () => {
    setIsPlaying(false);
    controls.stop();
  };
  
  return (
    <div className="framer-motion-test" style={{ position: 'relative', width: '100%', height: '400px', border: '1px solid #ddd' }}>
      <motion.div
        animate={controls}
        initial={{ x: 50, y: 50, rotate: 0, scale: 1, opacity: 1 }}
        style={{
          width: 100,
          height: 100,
          borderRadius: 10,
          backgroundColor: '#3498db',
          position: 'absolute'
        }}
      />
      
      <div className="controls" style={{ position: 'absolute', bottom: 10, left: 10 }}>
        <button onClick={playAnimation} disabled={isPlaying}>Play</button>
        <button onClick={stopAnimation} disabled={!isPlaying}>Stop</button>
        <div>
          Current Time: {currentPosition.toFixed(2)}s / {duration}s
        </div>
      </div>
    </div>
  );
};

export default FramerMotionTest;
