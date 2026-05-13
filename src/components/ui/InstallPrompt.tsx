'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };

    const installedHandler = () => {
      setShow(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setShow(false);
    setDeferredPrompt(null);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[999] flex items-center gap-3 rounded-2xl border border-[#c4622d]/40 bg-[#1a1108] p-4 shadow-2xl md:left-auto md:right-6 md:w-80">
      <Image
        src="/logo.png"
        alt="JANJIA Logo"
        width={44}
        height={44}
        className="h-11 w-11 rounded-xl object-contain"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-white">Install JANJIA</p>
        <p className="mt-0.5 text-xs leading-tight text-[#a08060]">
          Akses menu lebih cepat dari home screen
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <button
          onClick={handleInstall}
          className="rounded-lg bg-[#c4622d] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#d4723d]"
        >
          Install
        </button>
        <button
          onClick={() => setShow(false)}
          className="rounded-lg bg-[#2a2010] px-3 py-1.5 text-xs text-[#a08060] transition-colors hover:bg-[#3a3020]"
        >
          Nanti
        </button>
      </div>
    </div>
  );
}