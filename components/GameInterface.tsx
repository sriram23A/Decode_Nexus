import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppScreen, GameState, UserProfile } from '../types';
import { CipherService } from '../services/cipherService';
import { audioService } from '../services/audioService';
import { WORD_LIST, INITIAL_TIME, HINT_PENALTY, SKIP_PENALTY, WRONG_PENALTY, LEVEL_CONFIG } from '../constants';
import CyberButton from './CyberButton';
import { Timer, AlertTriangle, Lightbulb, SkipForward } from 'lucide-react';

interface GameInterfaceProps {
  user: UserProfile;
  updateUser: (user: UserProfile) => void;
  onExit: () => void;
  customWords: string[];
}

const GameInterface: React.FC<GameInterfaceProps> = ({ user, updateUser, onExit, customWords }) => {
  const [gameState, setGameState] = useState<GameState>({
    isActive: false,
    currentWord: '',
    currentEncoded: '',
    cipherType: LEVEL_CONFIG[1][0],
    difficulty: 1,
    score: 0,
    timeLeft: INITIAL_TIME,
    streak: 0,
    hintsUsed: 0
  });

  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<string[]>(['> SYSTEM INITIALIZED', '> WAITING FOR INPUT...']);
  const [shake, setShake] = useState(false);
  const [showHint, setShowHint] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper to add logs
  const addLog = (msg: string) => {
    setLogs(prev => [`> ${msg}`, ...prev].slice(0, 5));
  };

  // Generate new puzzle
  const generatePuzzle = useCallback((level: number) => {
    // Merge standard list with custom words if available
    const activeWordList = customWords.length > 0 ? [...WORD_LIST, ...customWords] : WORD_LIST;
    
    // Weight custom words slightly higher if they exist? No, just random for now.
    const word = activeWordList[Math.floor(Math.random() * activeWordList.length)];
    
    // Cap level at 10 for config lookup
    const configLevel = Math.min(level, 10) as keyof typeof LEVEL_CONFIG;
    const availableCiphers = LEVEL_CONFIG[configLevel];
    const type = availableCiphers[Math.floor(Math.random() * availableCiphers.length)];
    
    const encoded = CipherService.encrypt(word, type, level);

    setGameState(prev => ({
      ...prev,
      currentWord: word,
      currentEncoded: encoded,
      cipherType: type,
      isActive: true,
    }));
    
    setInput('');
    setShowHint(null);
    if(inputRef.current) inputRef.current.focus();
  }, [customWords]);

  // Initialize Game
  useEffect(() => {
    generatePuzzle(1);
    if (customWords.length > 0) {
      addLog(`DETECTED ${customWords.length} CUSTOM SIGNATURES`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer Logic
  useEffect(() => {
    if (!gameState.isActive || gameState.timeLeft <= 0) return;

    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          audioService.play('error');
          addLog("TIME EXPIRED. CONNECTION TERMINATED.");
          return { ...prev, timeLeft: 0, isActive: false };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.isActive, gameState.timeLeft]);

  // Handle Submission
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!gameState.isActive) return;

    const guess = input.toUpperCase().trim();
    
    if (guess === gameState.currentWord) {
      // WIN
      audioService.play('success');
      const timeBonus = gameState.timeLeft * 2;
      const streakBonus = gameState.streak * 50;
      const levelBonus = gameState.difficulty * 100;
      const points = levelBonus + timeBonus + streakBonus;

      addLog(`DECRYPTION SUCCESSFUL. +${points} XP`);
      
      const nextLevel = gameState.difficulty < 10 && gameState.streak > 0 && gameState.streak % 3 === 0 
        ? gameState.difficulty + 1 
        : gameState.difficulty;

      setGameState(prev => ({
        ...prev,
        score: prev.score + points,
        streak: prev.streak + 1,
        difficulty: nextLevel,
        timeLeft: Math.min(prev.timeLeft + 15, 99) // Add time back
      }));

      generatePuzzle(nextLevel);
    } else {
      // FAIL
      audioService.play('error');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      addLog(`INVALID KEY. PENALTY -${WRONG_PENALTY}`);
      
      setGameState(prev => ({
        ...prev,
        score: Math.max(0, prev.score - WRONG_PENALTY),
        streak: 0
      }));
    }
  };

  const useHint = () => {
    if (gameState.score < HINT_PENALTY) {
      addLog("INSUFFICIENT RESOURCES FOR HINT");
      return;
    }
    setGameState(prev => ({ ...prev, score: prev.score - HINT_PENALTY, hintsUsed: prev.hintsUsed + 1 }));
    const hint = CipherService.getHint(gameState.currentWord, gameState.currentEncoded, gameState.cipherType);
    setShowHint(hint);
    addLog("HINT DEPLOYED");
  };

  const skipPuzzle = () => {
    setGameState(prev => ({ ...prev, score: Math.max(0, prev.score - SKIP_PENALTY), streak: 0 }));
    addLog("PROTOCOL BYPASSED");
    generatePuzzle(gameState.difficulty);
  };

  // Game Over handling
  if (!gameState.isActive && gameState.timeLeft === 0) {
    const isHighScore = gameState.score > user.highScore;
    
    return (
      <div className="flex flex-col items-center justify-center h-full animate-enter">
        <div className="bg-black/80 border border-red-500 p-8 text-center max-w-lg w-full">
          <h2 className="text-4xl text-red-500 font-bold mb-4 glitch-text">SYSTEM FAILURE</h2>
          <p className="text-gray-300 mb-6">Trace completed. Connection severed.</p>
          
          <div className="flex justify-between mb-4 border-b border-gray-700 pb-2">
            <span>FINAL SCORE</span>
            <span className="text-[#00f3ff] font-bold">{gameState.score}</span>
          </div>
          {isHighScore && <div className="text-green-500 mb-6 animate-pulse">NEW HIGH SCORE!</div>}
          
          <div className="flex gap-4 justify-center">
            <CyberButton 
              label="RETRY" 
              onClick={() => {
                if (isHighScore) updateUser({ ...user, highScore: gameState.score });
                setGameState(prev => ({ ...prev, isActive: true, timeLeft: INITIAL_TIME, score: 0, difficulty: 1, streak: 0 }));
                generatePuzzle(1);
              }} 
            />
            <CyberButton 
              label="EXIT" 
              variant="danger" 
              onClick={() => {
                if (isHighScore) updateUser({ ...user, highScore: gameState.score });
                onExit();
              }} 
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col p-4 max-w-4xl mx-auto ${shake ? 'animate-[translate_0.1s_infinite]' : ''}`}>
      {/* Top HUD */}
      <div className="flex justify-between items-end border-b-2 border-[#00f3ff]/30 pb-4 mb-6">
        <div>
          <div className="text-xs text-gray-500">TARGET ENCRYPTION</div>
          <div className="text-xl font-bold text-[#00f3ff]">{gameState.cipherType}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">SECURE CHANNEL</div>
          <div className="text-4xl font-mono font-bold text-white tracking-widest">{gameState.score.toString().padStart(6, '0')}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">THREAT LEVEL</div>
          <div className="text-xl font-bold text-yellow-500">LVL {gameState.difficulty}</div>
        </div>
      </div>

      {/* Main Puzzle Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="flex items-center gap-2 mb-2 text-red-500 font-bold text-2xl animate-pulse">
          <Timer /> {gameState.timeLeft}s
        </div>
        
        <div className="w-full bg-black/50 border-l-4 border-red-500 p-8 mb-8 relative transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,0,0,0.3)]">
          <div className="absolute top-0 left-0 bg-red-500 text-black text-xs px-2 py-1 font-bold">ENCRYPTED PACKET</div>
          <div className="text-3xl md:text-5xl font-mono text-center break-all text-red-500 tracking-widest min-h-[60px]">
            {gameState.currentEncoded}
          </div>
        </div>

        {showHint && (
           <div className="mb-4 text-yellow-400 border border-yellow-500/30 bg-yellow-900/10 px-4 py-2 text-sm rounded animate-slide-in">
             TIP: {showHint}
           </div>
        )}

        <form onSubmit={handleSubmit} className="w-full max-w-xl relative">
          <input 
            ref={inputRef}
            type="text" 
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              audioService.play('type');
            }}
            className="w-full bg-transparent border-b-4 border-[#00f3ff] text-white text-3xl font-mono p-4 outline-none text-center uppercase focus:border-white transition-colors placeholder-gray-700"
            placeholder="DECRYPT..."
            autoFocus
          />
        </form>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button onClick={useHint} className="flex flex-col items-center gap-1 text-yellow-500 hover:text-yellow-300 transition-colors transform hover:scale-105 duration-200">
            <div className="p-3 border border-yellow-500/30 rounded-full hover:bg-yellow-500/10"><Lightbulb /></div>
            <span className="text-xs">HINT (-{HINT_PENALTY})</span>
          </button>
          
          <CyberButton label="EXECUTE" onClick={() => handleSubmit()} className="min-w-[150px]" />
          
          <button onClick={skipPuzzle} className="flex flex-col items-center gap-1 text-red-500 hover:text-red-300 transition-colors transform hover:scale-105 duration-200">
            <div className="p-3 border border-red-500/30 rounded-full hover:bg-red-500/10"><SkipForward /></div>
            <span className="text-xs">SKIP (-{SKIP_PENALTY})</span>
          </button>
        </div>
      </div>

      {/* Logs Console */}
      <div className="mt-auto h-32 border-t border-gray-800 bg-black/40 p-2 font-mono text-xs md:text-sm overflow-hidden flex flex-col justify-end">
        {logs.map((log, i) => (
          <div key={i} className={`mb-1 animate-slide-in ${log.includes('SUCCESS') ? 'text-green-500' : log.includes('ERROR') || log.includes('PENALTY') ? 'text-red-500' : 'text-[#00f3ff]'}`}>
            {log}
          </div>
        ))}
      </div>

      <div className="absolute top-4 left-4">
        <button onClick={onExit} className="text-gray-600 hover:text-white text-xs underline">ABORT MISSION</button>
      </div>
    </div>
  );
};

export default GameInterface;
