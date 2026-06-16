import React, { useEffect, useRef, useState } from 'react';

const PrimeLogo = ({ size = 100, glow = true, interactive = true }) => {
  const canvasRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (size < 80 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Set internal resolution higher for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    // Nebula Gas Cloud definition
    const clouds = [
      { x: size * 0.3, y: size * 0.3, vx: 0.15, vy: 0.1, r: size * 0.45, color: 'rgba(90, 200, 250, 0.22)' }, // Sky blue
      { x: size * 0.7, y: size * 0.4, vx: -0.1, vy: 0.15, r: size * 0.5, color: 'rgba(191, 90, 242, 0.22)' }, // Violet
      { x: size * 0.4, y: size * 0.7, vx: 0.08, vy: -0.12, r: size * 0.4, color: 'rgba(255, 45, 85, 0.18)' },  // Magenta
      { x: size * 0.6, y: size * 0.6, vx: -0.12, vy: -0.08, r: size * 0.45, color: 'rgba(255, 159, 10, 0.18)' } // Gold
    ];

    // Constellation Particles
    const particles = [];
    const particleCount = Math.min(18, Math.floor(size / 6));
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * size,
        y: Math.random() * size,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.3
      });
    }

    let angle = 0;

    const animate = () => {
      ctx.clearRect(0, 0, size, size);
      
      // Draw dark background space
      ctx.fillStyle = '#05050d';
      ctx.fillRect(0, 0, size, size);

      // 1. Draw Real-time Gaseous Nebula
      ctx.globalCompositeOperation = 'screen';
      clouds.forEach((cloud, i) => {
        // Move cloud organically with boundaries
        cloud.x += cloud.vx;
        cloud.y += cloud.vy;
        
        if (cloud.x < size * 0.15 || cloud.x > size * 0.85) cloud.vx *= -1;
        if (cloud.y < size * 0.15 || cloud.y > size * 0.85) cloud.vy *= -1;

        // Draw radial gradient for the gas cloud
        const grad = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.r);
        grad.addColorStop(0, cloud.color);
        grad.addColorStop(0.5, cloud.color.replace('0.22', '0.08').replace('0.18', '0.06'));
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw Twinkling Constellation Networks (Sharp Pastel Stars)
      ctx.globalCompositeOperation = 'source-over';
      
      // Draw network lines
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.08)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < size * 0.35) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw star nodes
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > size) p.vx *= -1;
        if (p.y < 0 || p.y > size) p.vy *= -1;

        // Twinkle effect
        p.alpha += (Math.random() - 0.5) * 0.05;
        p.alpha = Math.max(0.2, Math.min(0.8, p.alpha));

        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        // Subtle glow around sharp stars
        if (p.r > 1.2) {
          ctx.fillStyle = `rgba(90, 200, 250, ${p.alpha * 0.3})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 3. Draw Orbiting Energy Rings (Subtle pastel paths)
      angle += 0.003;
      ctx.strokeStyle = 'rgba(90, 200, 250, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size * 0.32, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(191, 90, 242, 0.04)';
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size * 0.24, 0, Math.PI * 2);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [size]);

  const logoContent = (
    <img 
      src="/prime-logo.jpg" 
      alt="PRIME.AI" 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        zIndex: 2,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      }}
    />
  );

  return (
    <div 
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: size < 80 ? '16px' : '54px',
        overflow: 'hidden',
        boxShadow: glow ? '0 12px 40px rgba(139, 92, 246, 0.15), 0 0 20px rgba(0, 240, 255, 0.1)' : 'none',
        display: 'inline-block',
        backgroundColor: '#05050d',
      }}
    >
      {/* 1. Dynamic Moving Nebula Layer (Runs on High-fidelity Canvas) */}
      {size >= 80 && (
        <canvas 
          ref={canvasRef} 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: size,
            height: size,
            zIndex: 1,
          }}
        />
      )}

      {/* 2. SSR/Fallback Static Nebula CSS Background (visible if canvas loading or small size) */}
      {(!mounted || size < 80) && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 30% 30%, rgba(90, 200, 250, 0.15) 0%, rgba(191, 90, 242, 0.15) 50%, rgba(0,0,0,0) 100%), radial-gradient(circle at 70% 70%, rgba(255, 45, 85, 0.15) 0%, rgba(255, 159, 10, 0.12) 50%, rgba(0,0,0,0) 100%)',
            zIndex: 1,
          }}
        />
      )}

      {/* 3. High-fidelity Crystal Image Logo Overlay */}
      {logoContent}
    </div>
  );
};

export default PrimeLogo;

