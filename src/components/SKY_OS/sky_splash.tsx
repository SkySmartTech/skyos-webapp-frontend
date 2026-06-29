import { useEffect } from 'react';
import nexisLogo from '../../assets/nexis.png';

interface SkySplashProps {
  onComplete: () => void;
}

export default function SkySplash({ onComplete }: SkySplashProps) {
  useEffect(() => {
    const t = setTimeout(onComplete, 2000);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center gap-4">
      <img
        src={nexisLogo}
        alt="NEXIS"
        className="w-24 h-24 object-contain rounded-2xl"
      />
      <div className="text-center">
        <h1 className="text-5xl font-black tracking-wide text-white leading-none">
          NEX<span className="text-[#2563EB]">IS</span>
        </h1>
        <p className="text-xs font-medium uppercase tracking-widest text-[#475569] mt-2">
          Smart Factory Operating System
        </p>
      </div>
    </div>
  );
}
