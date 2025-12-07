import React, { useState } from 'react';
import CyberButton from './CyberButton';
import { audioService } from '../services/audioService';
import { UserProfile } from '../types';

interface LoginScreenProps {
  onLogin: (user: UserProfile) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username) {
      setError('USERNAME REQUIRED');
      audioService.play('error');
      return;
    }

    setLoading(true);
    audioService.play('click');

    // Simulate network request
    setTimeout(() => {
      setLoading(false);
      // Create a new user profile
      const newUser: UserProfile = {
        username: username.toUpperCase(),
        level: 1,
        xp: 0,
        highScore: 0,
        matchesPlayed: 0
      };
      onLogin(newUser);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4">
      <div className="w-full max-w-md bg-[#0a141e]/90 border border-[#00f3ff] p-8 shadow-[0_0_50px_rgba(0,243,255,0.2)] backdrop-blur-md transform transition-all hover:scale-[1.01]">
        <div className="text-xs text-[#00f3ff] mb-2 tracking-widest">SECURE ACCESS TERMINAL</div>
        <h2 className="text-3xl font-bold mb-8 text-white tracking-widest border-b border-gray-700 pb-4">
          IDENTIFICATION
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="relative group">
            <label className="block text-xs text-gray-500 mb-1 group-focus-within:text-[#00f3ff]">CODENAME</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/50 border-b-2 border-gray-700 focus:border-[#00f3ff] text-white p-2 outline-none transition-colors font-mono text-xl uppercase"
              placeholder="ENTER ALIAS..."
              autoFocus
            />
          </div>

          <div className="relative group">
            <label className="block text-xs text-gray-500 mb-1 group-focus-within:text-[#00f3ff]">ACCESS KEY</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border-b-2 border-gray-700 focus:border-[#00f3ff] text-white p-2 outline-none transition-colors font-mono text-xl"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-[#ff2a2a] text-sm animate-pulse border border-[#ff2a2a]/30 p-2 bg-[#ff2a2a]/10">
              [ERROR]: {error}
            </div>
          )}

          <div className="mt-4">
            <CyberButton 
              label={loading ? "AUTHENTICATING..." : "INITIATE LINK"} 
              type="submit" 
              disabled={loading}
              className="w-full"
            />
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-gray-600">
          WARNING: UNAUTHORIZED ACCESS IS A CLASS A FELONY UNDER NEXUS PROTOCOLS.
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
