import { useEffect, useState } from 'react';
import skyosLogo from '../../assets/skyos.png';

interface SkySplashProps {
  onComplete: () => void;
}

export default function SkySplash({ onComplete }: SkySplashProps) {
  const [exiting, setExiting] = useState(false);

  // Hold the logo for 3 s, then trigger exit animation
  useEffect(() => {
    const t = setTimeout(() => setExiting(true), 3000);
    return () => clearTimeout(t);
  }, []);

  // After the 0.8 s exit animation finishes, hand off to parent
  useEffect(() => {
    if (!exiting) return;
    const t = setTimeout(onComplete, 800);
    return () => clearTimeout(t);
  }, [exiting, onComplete]);

  return (
    <div
      style={{
        position: 'absolute', inset: 0, zIndex: 1,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      <style>{`
        /* ── Entrance: rise up + scale in ─────────────────────────── */
        @keyframes splashIn {
          0%   { opacity: 0; transform: scale(0.72) translateY(36px); }
          60%  { opacity: 1; transform: scale(1.04) translateY(-6px); }
          100% { opacity: 1; transform: scale(1)    translateY(0); }
        }
        /* ── Exit: zoom OUT (shrink + fade) — reveals background ──── */
        @keyframes splashOut {
          0%   { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.55); }
        }
        /* ── Subtle orange halo pulse on the logo ───────────────────  */
        @keyframes haloPulse {
          0%, 100% { box-shadow: 0 0  0px  0px rgba(249,115,22,0); }
          50%      { box-shadow: 0 0 50px 14px rgba(249,115,22,0.25); }
        }
        /* ── Subtitle letter-spacing breathe ───────────────────────── */
        @keyframes subtitleFade {
          from { opacity: 0; letter-spacing: 0.35em; }
          to   { opacity: 1; letter-spacing: 0.25em; }
        }

        .splash-wrap {
          display: flex; flex-direction: column;
          align-items: center; gap: 16px;
          animation: splashIn 1s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        .splash-wrap.exit {
          animation: splashOut 0.8s cubic-bezier(0.4,0,1,1) forwards;
        }
        .splash-logo {
          border-radius: 22px;
          animation: haloPulse 2.4s ease-in-out 1s infinite;
        }
        .splash-subtitle {
          animation: subtitleFade 1.2s ease-out 0.5s both;
        }
      `}</style>

      <div className={`splash-wrap${exiting ? ' exit' : ''}`}>
        <img
          src={skyosLogo}
          alt="SkyOS"
          className="splash-logo"
          style={{ width: 108, height: 108, objectFit: 'contain' }}
        />
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            margin: 0,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '2.8rem',
            fontWeight: 900,
            letterSpacing: '0.05em',
            color: '#ffffff',
            lineHeight: 1,
          }}>
            Sky<span style={{ color: '#f97316' }}>OS</span>
          </h1>
          <p
            className="splash-subtitle"
            style={{
              margin: '8px 0 0',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '0.68rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              color: '#52525b',
            }}
          >
            Smart Factory Operating System
          </p>
        </div>
      </div>
    </div>
  );
}
