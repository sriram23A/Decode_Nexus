import React, { useEffect, useState } from 'react';
import { audioService } from '../services/audioService';

interface BootSequenceProps {
  onComplete: () => void;
}

const BIOS_CHECK = [
  "BIOS DATE 01/01/2099 14:22:55 VER: 9.0.4",
  "CPU: QUANTUM CORE X-99 @ 128.0 THz",
  "MEMORY TEST: 131072TB OK",
  "DETECTING PRIMARY MASTER ... NEXUS_DRIVE",
  "DETECTING SECURITY MODULE ... ENCRYPTED",
  "BOOT DEVICE PRIORITY: OPTICAL / HOLOGRAPHIC",
  "LOADING KERNEL..."
];

const BOOT_LOGS = [
  "INITIALIZING KERNEL MODULES...",
  "LOADING DRIVERS: [OK]",
  "MOUNTING FILE SYSTEMS: [OK]",
  "CHECKING SECURITY PROTOCOLS...",
  "ENCRYPTION: AES-256 [ACTIVE]",
  "NETWORK: CONNECTED (SECURE)",
  "ESTABLISHING NEURAL LINK...",
  "SYSTEM INTEGRITY: 99.9%",
  "DECRYPTING USER INTERFACE...",
];

const ASCII_ART = `
  _   _  _______  __  _  _  ____  
 | \\ | || ____\\ \\/ / | || |/ ___| 
 |  \\| ||  _|  \\  /  | || |\\___ \\ 
 | |\\  || |___ /  \\  | || | ___) |
 |_| \\_||_____/_/\\_\\  \\__/ |____/ 
`;

const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'BIOS' | 'LOGO' | 'LOGS'>('BIOS');
  const [biosLines, setBiosLines] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  // Phase 1: BIOS Check
  useEffect(() => {
    let currentLine = 0;
    audioService.play('boot');
    
    const biosInterval = setInterval(() => {
      if (currentLine < BIOS_CHECK.length) {
        setBiosLines(prev => [...prev, BIOS_CHECK[currentLine]]);
        audioService.play('type');
        currentLine++;
      } else {
        clearInterval(biosInterval);
        setTimeout(() => setPhase('LOGO'), 800);
      }
    }, 150);

    return () => clearInterval(biosInterval);
  }, []);

  // Phase 2: Logo & Progress
  useEffect(() => {
    if (phase !== 'LOGO') return;

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setPhase('LOGS');
          return 100;
        }
        return prev + 2; // Speed of bar
      });
    }, 30);

    return () => clearInterval(progressInterval);
  }, [phase]);

  // Phase 3: System Logs
  useEffect(() => {
    if (phase !== 'LOGS') return;

    let currentLog = 0;
    const logInterval = setInterval(() => {
      if (currentLog < BOOT_LOGS.length) {
        setLogs(prev => [...prev, BOOT_LOGS[currentLog]]);
        audioService.play('type');
        currentLog++;
      } else {
        clearInterval(logInterval);
        setTimeout(onComplete, 1200);
      }
    }, 100);

    return () => clearInterval(logInterval);
  }, [phase, onComplete]);

  if (phase === 'BIOS') {
    return (
      <div className="w-full h-full p-8 font-mono text-xs md:text-sm text-[#00f3ff] flex flex-col justify-start">
        {biosLines.map((line, i) => (
          <div key={i} className="mb-1">{line}</div>
        ))}
        <div className="animate-pulse mt-2">_</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-full p-10 font-mono relative">
      <div className="w-full max-w-2xl z-10">
        
        {/* Logo ASCII */}
        <pre className={`text-[#00f3ff] font-bold text-center text-[10px] md:text-sm leading-none mb-10 transition-opacity duration-1000 ${phase === 'LOGO' || phase === 'LOGS' ? 'opacity-100' : 'opacity-0'}`}>
          {ASCII_ART}
        </pre>

        {/* Loading Bar (Visible in LOGO phase) */}
        {phase === 'LOGO' && (
          <div className="w-full max-w-md mx-auto mb-8">
            <div className="flex justify-between text-xs text-[#00f3ff] mb-1">
              <span>LOADING NEXUS_OS</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full bg-gray-900 border border-[#00f3ff]/30">
              <div 
                className="h-full bg-[#00f3ff] shadow-[0_0_10px_#00f3ff]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Fast Scrolling Logs (Visible in LOGS phase) */}
        {phase === 'LOGS' && (
           <div className="bg-black/50 border border-green-900 p-4 h-48 overflow-hidden flex flex-col-reverse shadow-[0_0_20px_rgba(0,255,0,0.1)] relative">
             <div className="absolute top-0 right-0 p-2 text-xs text-green-500 animate-pulse">SYSTEM_ACTIVE</div>
             {logs.map((log, i) => (
               <div key={i} className="text-green-500 text-sm mb-1 animate-slide-in">
                 <span className="opacity-50 mr-2">{`>`}</span>
                 {log}
               </div>
             ))}
           </div>
        )}
      </div>
    </div>
  );
};

export default BootSequence;
