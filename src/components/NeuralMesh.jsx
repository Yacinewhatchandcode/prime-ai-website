import React, { useEffect, useRef } from 'react';

const NeuralMesh = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    let particles = [];
    let clouds = [];
    const particleCount = Math.min(Math.floor((width * height) / 12000), 120);
    const cloudCount = 8;
    const maxDistance = 180;
    
    class Cloud {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.15; // Extremely slow, smooth pace
        this.vy = (Math.random() - 0.5) * 0.15;
        this.radius = Math.random() * 600 + 400; // Massive soft volumetric fog
        
        // Deep cosmic non-pastel colors for environmental depth
        const colors = [
            'rgba(10, 15, 60, 0.2)', // Deep Void Blue
            'rgba(30, 10, 50, 0.2)', // Deep Void Indigo
            'rgba(15, 30, 50, 0.15)', // Deep Ocean Tech
            'rgba(40, 15, 60, 0.15)', // Deep Magenta Nebula
            'rgba(20, 20, 30, 0.3)'   // Space Fog
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < -this.radius) this.x = width + this.radius;
        if (this.x > width + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = height + this.radius;
        if (this.y > height + this.radius) this.y = -this.radius;
      }
      
      draw() {
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        grad.addColorStop(0, this.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6; // Smooth, slightly faster pace
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 1.5 + 0.5;
        // 70% light blue, 20% bright gold, 10% magenta for DNA
        const rand = Math.random();
        if (rand > 0.3) this.color = '#60a5fa';
        else if (rand > 0.1) this.color = '#fcd34d';
        else this.color = '#ec4899';
        
        this.seed = Math.random() * 100;
        this.isDnaNode = Math.random() > 0.85; // 15% chance to act as a DNA spawner
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
      }
    }
    
    // Initialize Arrays
    for (let i = 0; i < cloudCount; i++) clouds.push(new Cloud());
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    
    let animationFrameId;
    
    const drawDNA = (x1, y1, x2, y2, time, opacity) => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        const segments = Math.floor(dist / 4);
        
        ctx.save();
        ctx.translate(x1, y1);
        ctx.rotate(angle);
        
        // Helix Strand 1 (Purple/Pink)
        ctx.beginPath();
        ctx.strokeStyle = `rgba(236, 72, 153, ${opacity * 0.8})`;
        ctx.lineWidth = 1;
        for (let k = 0; k <= segments; k++) {
            const x = (k / segments) * dist;
            const y = Math.sin(k * 0.5 - time * 3) * 6;
            if (k === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Helix Strand 2 (Cyan/Blue)
        ctx.beginPath();
        ctx.strokeStyle = `rgba(96, 165, 250, ${opacity * 0.8})`;
        ctx.lineWidth = 1;
        for (let k = 0; k <= segments; k++) {
            const x = (k / segments) * dist;
            const y = Math.sin(k * 0.5 - time * 3 + Math.PI) * 6;
            if (k === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // 1. Draw Nebula Clouds
      ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < clouds.length; i++) {
        clouds[i].update();
        clouds[i].draw();
      }
      
      ctx.globalCompositeOperation = 'source-over';
      const time = Date.now() * 0.002;
      
      // 2. Draw Particles & Neural/DNA connections
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        ctx.shadowBlur = 0; // Reset for lines
        
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const baseOpacity = 1 - (distance / maxDistance);
            const pulse = (Math.sin(time * 2.5 + particles[i].seed) + 1) * 0.5;
            const finalOpacity = baseOpacity * (0.1 + pulse * 0.9);
            
            // DNA Link Rendering
            if ((particles[i].isDnaNode || particles[j].isDnaNode) && distance > 30) {
                drawDNA(particles[i].x, particles[i].y, particles[j].x, particles[j].y, time, finalOpacity);
                continue;
            }
            
            // Standard Neural Lightning Rendering
            ctx.beginPath();
            const isGoldSpark = particles[i].color === '#fcd34d' || particles[j].color === '#fcd34d';
            
            if (isGoldSpark) {
                ctx.strokeStyle = `rgba(245, 158, 11, ${finalOpacity * 0.8})`; // Gold lightning
            } else {
                ctx.strokeStyle = `rgba(96, 165, 250, ${finalOpacity * 0.4})`; // Blue neural link
            }
            
            ctx.lineWidth = isGoldSpark ? 1.5 : 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      
      const newCount = Math.min(Math.floor((width * height) / 12000), 120);
      if (newCount > particles.length) {
          for(let i = particles.length; i < newCount; i++) particles.push(new Particle());
      } else {
          particles.splice(newCount);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -2,
        pointerEvents: 'none',
        mixBlendMode: 'screen'
      }} 
    />
  );
};

export default NeuralMesh;
