import { useMemo } from 'react';

interface Particle {
  id: number;
  left: string;
  top: string;
  tx: string;
  ty: string;
  rot: string;
  duration: string;
  delay: string;
  size: number;
  color: string;
}

const FloatingParticles = () => {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      tx: `${(Math.random() - 0.5) * 150}px`,
      ty: `${(Math.random() - 0.5) * 150 - 100}px`,
      rot: `${Math.random() * 360}deg`,
      duration: `${10 + Math.random() * 15}s`,
      delay: `${Math.random() * 10}s`,
      size: 2 + Math.random() * 4,
      color: ['rgba(139, 92, 246, 0.5)', 'rgba(34, 211, 238, 0.4)', 'rgba(244, 114, 182, 0.4)'][Math.floor(Math.random() * 3)],
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            '--tx': p.tx,
            '--ty': p.ty,
            '--rot': p.rot,
            '--duration': p.duration,
            '--delay': p.delay,
            animation: `float-particle var(--duration) ease-in-out infinite`,
            animationDelay: `var(--delay)`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

const AnimatedBackground = () => {
  return (
    <>
      {/* Aurora gradient background */}
      <div className="aurora-bg" />
      
      {/* Mesh grid overlay */}
      <div className="mesh-overlay" />
      
      {/* Floating orbs */}
      <div className="floating-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>
      
      {/* Floating particles */}
      <FloatingParticles />
    </>
  );
};

export default AnimatedBackground;
