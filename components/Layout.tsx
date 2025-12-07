import React, { useEffect, useRef } from 'react';
import { SystemSettings } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  settings: SystemSettings;
  screenKey: string; // Used to trigger animations on change
}

const Layout: React.FC<LayoutProps> = ({ children, settings, screenKey }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle System
  useEffect(() => {
    if (!settings.crtEffects) return; 
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const particles: Array<{x: number, y: number, vx: number, vy: number, size: number, alpha: number}> = [];
    const count = settings.particleDensity === 'HIGH' ? 80 : 30;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2,
        alpha: Math.random() * 0.5 + 0.1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.fillStyle = `rgba(0, 243, 255, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connections
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [settings.crtEffects, settings.particleDensity]);

  return (
    <div className="relative w-screen h-screen bg-[#050505] text-[#00f3ff] overflow-hidden">
      {/* Background Canvas (Fixed) */}
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none" />
      
      {/* CRT Effects Layer (Fixed & Transparent to clicks) */}
      {settings.crtEffects && (
        <>
          <div className="crt-overlay pointer-events-none" />
          <div className="crt-scanline pointer-events-none" />
        </>
      )}

      {/* Main Content - SCROLLABLE */}
      {/* Changed h-full to flex-1 and added overflow-y-auto to allow scrolling if content overflows */}
      <div className={`relative z-10 w-full h-full flex flex-col ${settings.crtEffects ? 'animate-[flicker_infinite_4s]' : ''}`}>
        <div 
          key={screenKey}
          className="w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
