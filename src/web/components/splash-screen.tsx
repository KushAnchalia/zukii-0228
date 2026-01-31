import { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');

  useEffect(() => {
    // Entry animation completes
    const holdTimer = setTimeout(() => setPhase('hold'), 600);
    // Start exit after hold
    const exitTimer = setTimeout(() => setPhase('exit'), 1800);
    // Complete and unmount
    const completeTimer = setTimeout(() => onComplete(), 2400);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-[#050208] flex items-center justify-center transition-opacity duration-500 ${
        phase === 'exit' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Aurora background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2 opacity-50"
          style={{
            background: `
              radial-gradient(ellipse 40% 30% at 30% 40%, rgba(139, 92, 246, 0.4) 0%, transparent 70%),
              radial-gradient(ellipse 35% 40% at 70% 60%, rgba(34, 211, 238, 0.3) 0%, transparent 70%),
              radial-gradient(ellipse 30% 35% at 50% 50%, rgba(244, 114, 182, 0.25) 0%, transparent 70%)
            `,
            animation: 'splash-aurora 3s ease-in-out infinite',
          }}
        />
      </div>

      {/* Radial glow behind logo */}
      <div 
        className={`absolute w-96 h-96 rounded-full transition-all duration-1000 ${
          phase === 'enter' ? 'scale-50 opacity-0' : phase === 'hold' ? 'scale-100 opacity-100' : 'scale-150 opacity-0'
        }`}
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(139, 92, 246, 0.1) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Pulsing rings */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={`absolute rounded-full border border-violet-500/20 transition-all duration-700 ${
            phase === 'enter' ? 'scale-0 opacity-0' : phase === 'hold' ? 'opacity-100' : 'scale-150 opacity-0'
          }`}
          style={{
            width: `${200 + i * 80}px`,
            height: `${200 + i * 80}px`,
            animation: phase === 'hold' ? `splash-ring 2s ease-out infinite ${i * 0.3}s` : 'none',
          }}
        />
      ))}

      {/* Logo and brand name container */}
      <div 
        className={`relative z-10 flex flex-col items-center transition-all duration-700 ease-out ${
          phase === 'enter' 
            ? 'opacity-0 scale-90 translate-y-4' 
            : phase === 'hold' 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-110 -translate-y-4'
        }`}
      >
        {/* Logo with glow effect */}
        <div className="relative mb-6">
          {/* Glow layer */}
          <img
            src="./chugli-logo-speech-wave-lrJ6m_0uOCFqaG1qx7mld.png"
            alt=""
            className="absolute inset-0 h-24 w-auto blur-xl opacity-60"
            style={{
              animation: phase === 'hold' ? 'splash-logo-glow 2s ease-in-out infinite' : 'none',
            }}
          />
          {/* Main logo */}
          <img
            src="./chugli-logo-speech-wave-lrJ6m_0uOCFqaG1qx7mld.png"
            alt="Zukii"
            className="relative h-24 w-auto"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.5))',
            }}
          />
        </div>

        {/* Brand name with morphing gradient */}
        <h1 
          className="text-5xl font-bold font-display tracking-tight"
          style={{
            background: 'linear-gradient(90deg, #8B5CF6, #22D3EE, #F472B6, #8B5CF6)',
            backgroundSize: '300% 100%',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: phase === 'hold' ? 'splash-gradient-shift 2s ease-in-out infinite' : 'none',
          }}
        >
          Zukii
        </h1>

        {/* Tagline with delayed fade in */}
        <p 
          className={`mt-4 text-gray-400 text-sm tracking-widest uppercase transition-all duration-500 delay-300 ${
            phase === 'hold' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          Voice AI Platform
        </p>

        {/* Loading indicator */}
        <div 
          className={`mt-8 flex items-center gap-2 transition-all duration-500 delay-500 ${
            phase === 'hold' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-violet-500"
                style={{
                  animation: 'splash-dot-bounce 1s ease-in-out infinite',
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes splash-aurora {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(2%, -2%) rotate(5deg); }
        }
        
        @keyframes splash-ring {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        
        @keyframes splash-logo-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        
        @keyframes splash-gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes splash-dot-bounce {
          0%, 80%, 100% { transform: scale(1); opacity: 0.5; }
          40% { transform: scale(1.3); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
