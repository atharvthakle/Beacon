import { BeaconChat } from '@/components/beacon-chat';
import Image from 'next/image';
import SoftAurora from '@/components/SoftAurora';

export default function Page() {
  return (
    <main className="min-h-screen w-full">
      {/* Navigation Bar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 border-b backdrop-blur-xl"
        style={{
          borderColor: 'rgba(99, 102, 241, 0.1)',
          backgroundColor: 'rgba(7, 7, 20, 0.4)',
        }}
      >
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Beacon" width={28} height={28} />
          <span className="text-white font-semibold text-sm">Beacon</span>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
          style={{
            borderColor: 'rgba(99, 102, 241, 0.3)',
            backgroundColor: 'rgba(99, 102, 241, 0.05)',
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-indigo-300">Powered by AI</span>
        </div>
      </nav>

      {/* Soft Aurora Background */}
      <div className="fixed inset-0 z-0">
        <SoftAurora
          speed={0.8}
          scale={1.4}
          brightness={1.2}
          color1="#92eee6"
          color2="#0006e1"
          noiseFrequency={3}
          noiseAmplitude={1}
          bandHeight={0.5}
          bandSpread={1.2}
          octaveDecay={0.1}
          layerOffset={0}
          colorSpeed={1.2}
          enableMouseInteraction={true}
          mouseInfluence={0.25}
        />
      </div>

      {/* Subtle beam accents on top of aurora */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute rounded-full blur-[150px]"
          style={{
            top: '-200px',
            left: '50%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%)',
            transform: 'translateX(-50%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-16 px-4">
        {/* Watermark */}
        <div
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
          style={{
            opacity: 0.04,
            fontSize: '200px',
            fontWeight: 'bold',
            color: 'rgba(99, 102, 241, 1)',
            overflow: 'hidden',
            textShadow: '0 0 80px rgba(99, 102, 241, 0.4)',
            filter: 'blur(8px)',
          }}
        >
          Beacon
        </div>

        {/* Chat Widget */}
        <div className="relative z-20 w-full max-w-lg">
          <BeaconChat />
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
          <p className="text-xs text-indigo-400/25">AI-powered support, always available</p>
        </div>
      </div>
    </main>
  );
}