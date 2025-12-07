import React from 'react';
import { AppScreen, UserProfile } from '../types';
import { Terminal, Settings, Database, Trophy, LogOut, UploadCloud } from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  setScreen: (screen: AppScreen) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, setScreen, onLogout }) => {
  return (
    <div className="flex flex-col min-h-full w-full max-w-6xl mx-auto p-4 md:p-8 animate-enter">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-[#00f3ff]/30 pb-4 mb-8 shrink-0">
        <div>
          <h1 className="text-4xl font-bold glitch-text text-white">NEXUS_CORE</h1>
          <div className="text-sm text-[#00f3ff] mt-1 tracking-widest">
            WELCOME BACK, OPERATIVE {user.username}
          </div>
        </div>
        <div className="text-right mt-4 md:mt-0">
          <div className="text-xs text-gray-500">SYSTEM STATUS</div>
          <div className="text-green-500 font-bold">OPTIMAL</div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 grow pb-8">
        
        {/* Play Module - Large */}
        <div className="col-span-1 md:col-span-4 relative group overflow-hidden border border-gray-800 bg-black/40 hover:border-[#00f3ff] transition-all duration-300 p-8 flex flex-col justify-center items-center cursor-pointer min-h-[240px] animate-stagger-1"
             onClick={() => setScreen(AppScreen.GAME)}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#00f3ff]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Terminal size={64} className="text-[#00f3ff] mb-4 group-hover:scale-110 transition-transform duration-300" />
          <h2 className="text-3xl font-bold text-white mb-2">DECRYPTION PROTOCOL</h2>
          <p className="text-gray-400 text-center max-w-md">
            Engage the cryptographic engine. Solve puzzles to earn XP and secure data packets.
          </p>
          <div className="mt-6 px-4 py-1 border border-[#00f3ff] text-[#00f3ff] text-xs uppercase tracking-widest bg-[#00f3ff]/10 group-hover:bg-[#00f3ff] group-hover:text-black transition-colors">
            Click to Start
          </div>
        </div>

        {/* Upload Module - New */}
        <div className="col-span-1 md:col-span-2 border border-gray-800 bg-black/40 hover:border-blue-500 transition-all duration-300 p-6 flex flex-col justify-between group cursor-pointer animate-stagger-2"
             onClick={() => setScreen(AppScreen.UPLOAD)}>
          <div className="flex justify-between items-start">
             <UploadCloud size={32} className="text-blue-500" />
             <div className="px-2 py-0.5 bg-blue-500/20 text-blue-500 text-[10px] font-bold">NEW</div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mt-4 group-hover:text-blue-500 transition-colors">CODE BREAKDOWN</h3>
            <p className="text-xs text-gray-400 mt-2">Upload files to extract custom puzzle keywords.</p>
          </div>
        </div>

        {/* Stats Module */}
        <div className="col-span-1 md:col-span-2 border border-gray-800 bg-black/40 hover:border-green-500 transition-all duration-300 p-6 flex flex-col justify-between group cursor-pointer animate-stagger-3"
             onClick={() => setScreen(AppScreen.ARCHIVES)}>
          <div className="flex justify-between items-start">
            <Trophy size={32} className="text-green-500" />
            <div className="text-right">
              <div className="text-xs text-gray-500">HIGH SCORE</div>
              <div className="text-2xl font-bold text-white">{user.highScore.toLocaleString()}</div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mt-4 group-hover:text-green-500 transition-colors">ARCHIVES</h3>
            <p className="text-xs text-gray-400 mt-2">View leaderboards and personal stats.</p>
          </div>
        </div>

        {/* Settings Module */}
        <div className="col-span-1 md:col-span-2 border border-gray-800 bg-black/40 hover:border-yellow-500 transition-all duration-300 p-6 flex flex-col justify-between group cursor-pointer animate-stagger-4"
             onClick={() => setScreen(AppScreen.SETTINGS)}>
          <Settings size={32} className="text-yellow-500" />
          <div>
            <h3 className="text-xl font-bold text-white mt-4 group-hover:text-yellow-500 transition-colors">SYSTEM CONFIG</h3>
            <p className="text-xs text-gray-400 mt-2">Adjust audio, visual, and interface parameters.</p>
          </div>
        </div>

        {/* Tutorial Module */}
        <div className="col-span-1 md:col-span-2 border border-gray-800 bg-black/40 hover:border-purple-500 transition-all duration-300 p-6 flex flex-col justify-between group cursor-pointer animate-stagger-5"
             onClick={() => setScreen(AppScreen.TUTORIAL)}>
          <Database size={32} className="text-purple-500" />
          <div>
            <h3 className="text-xl font-bold text-white mt-4 group-hover:text-purple-500 transition-colors">KNOWLEDGE BASE</h3>
            <p className="text-xs text-gray-400 mt-2">Learn cipher types and hacking strategies.</p>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="mt-8 flex justify-between items-center border-t border-gray-800 pt-4 shrink-0 animate-stagger-5">
        <div className="text-xs text-gray-600 font-mono">
          NEXUS_OS KERNEL 9.0.5 BUILD 2024
        </div>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 text-xs text-red-500 hover:text-red-400 transition-colors uppercase tracking-widest"
        >
          <LogOut size={14} />
          Terminate Session
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
