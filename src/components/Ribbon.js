import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import confetti from 'canvas-confetti';
import { colors, fonts } from 'styles/tokens';

const OverlayContainer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(15px);
  background: rgba(0, 0, 0, 0.4);
  transition: opacity 1.5s cubic-bezier(0.165, 0.84, 0.44, 1);
  opacity: ${props => props.$isCut ? 0 : 1};
  pointer-events: ${props => props.$isCut ? 'none' : 'auto'};
  visibility: ${props => props.$hidden ? 'hidden' : 'visible'};
`;

const DragWrapper = styled.div`
  transform: translateY(${props => props.$dragY}px) scale(${props => props.$isCut ? 0.8 : 1});
  transition: ${props => props.$isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'};
  cursor: grab;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  &:active {
    cursor: grabbing;
  }
`;

const InaugurateButton = styled.div`
  background: ${colors.orange};
  color: ${colors.ink};
  padding: 16px 32px;
  border-radius: 50px;
  font-family: ${fonts.mono};
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5), inset 0 -3px 0 rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  gap: 12px;
  
  /* Bouncing arrow animation */
  svg {
    animation: bounceDown 1.5s infinite;
  }
  
  @keyframes bounceDown {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(5px); }
    60% { transform: translateY(3px); }
  }
`;

export default function Ribbon() {
  const [isCut, setIsCut] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const startYRef = useRef(0);

  const fireConfetti = () => {
    var duration = 3 * 1000;
    var end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff0000', '#ffa500', '#ffffff', '#00ff00', '#0000ff']
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff0000', '#ffa500', '#ffffff', '#00ff00', '#0000ff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handlePointerDown = (e) => {
    if (isCut) return;
    setIsDragging(true);
    startYRef.current = e.clientY || (e.touches && e.touches[0].clientY);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || isCut) return;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const diffY = clientY - startYRef.current;
    
    // Only allow pulling downwards
    if (diffY > 0) {
      setDragY(diffY);
      // Trigger if pulled down enough
      if (diffY > 80) {
        triggerCut();
      }
    }
  };

  const handlePointerUp = () => {
    if (!isDragging || isCut) return;
    setIsDragging(false);
    
    // If not pulled enough, snap back or trigger on click
    if (dragY > 0 && dragY <= 80) {
      setDragY(0);
    } else if (dragY === 0) {
      // Allow simple click to inaugurate as well
      triggerCut();
    }
  };

  const triggerCut = () => {
    setIsDragging(false);
    setIsCut(true);
    fireConfetti();
    
    setTimeout(() => {
      setHidden(true);
    }, 1500);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);
    
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  });

  return (
    <OverlayContainer $isCut={isCut} $hidden={hidden}>
      <DragWrapper 
        $isCut={isCut}
        $isDragging={isDragging}
        $dragY={dragY}
        onPointerDown={handlePointerDown}
      >
        <InaugurateButton>
          Pull Down to Inaugurate
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        </InaugurateButton>
      </DragWrapper>
    </OverlayContainer>
  );
}
