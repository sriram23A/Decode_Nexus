import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import BootSequence from './components/BootSequence';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import GameInterface from './components/GameInterface';
import UploadInterface from './components/UploadInterface';
import CyberButton from './components/CyberButton';
import { AppScreen, UserProfile, SystemSettings, CipherType } from './types';
import { audioService } from './services/audioService';
import { CIPHER_DESCRIPTIONS } from './constants';

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.BOOT);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<SystemSettings>({
    soundEnabled: true,
    crtEffects: true,
    particleDensity: 'HIGH',
    typingSpeed: 50
  });
  const [customWords, setCustomWords] = useState<string[]>([]);

  // Init Audio
  useEffect(() => {
    const handleInteraction = () => {
      audioService.init();
      window.removeEventListener('click', handleInteraction);
    };
    window.addEventListener('click', handleInteraction);
    return () => window.removeEventListener('click', handleInteraction);
  }, []);

  // Update Settings
  const toggleSetting = (key: keyof SystemSettings) => {
    setSettings(prev => {
      const newState = { ...prev, [key]: !prev[key] };
      if (key === 'soundEnabled') audioService.setMute(!newState.soundEnabled);
      return newState;
    });
  };

  const handleUploadAnalyze = (words: string[]) => {
    // Append new words to existing custom words
    setCustomWords(prev => Array.from(new Set([...prev, ...words])));
    // Wait a brief moment then go to game
    setTimeout(() => {
        setScreen(AppScreen.GAME);
    }, 1500);
  };

  // Render logic based on screen state
  const renderScreen = () => {
    switch (screen) {
      case AppScreen.BOOT:
        return <BootSequence onComplete={() => setScreen(AppScreen.LOGIN)} />;
      
      case AppScreen.LOGIN:
        return <LoginScreen onLogin={(u) => { setUser(u); setScreen(AppScreen.DASHBOARD); }} />;
      
      case AppScreen.DASHBOARD:
        return user ? (
          <Dashboard 
            user={user} 
            setScreen={setScreen} 
            onLogout={() => { setUser(null); setScreen(AppScreen.LOGIN); }} 
          />
        ) : null;
      
      case AppScreen.GAME:
        return user ? (
          <GameInterface 
            user={user} 
            updateUser={setUser} 
            onExit={() => setScreen(AppScreen.DASHBOARD)}
            customWords={customWords}
          />
        ) : null;
      
      case AppScreen.UPLOAD:
        return (
          <UploadInterface 
             onBack={() => setScreen(AppScreen.DASHBOARD)}
             onAnalyze={handleUploadAnalyze}
          />
        );
      
      case AppScreen.ARCHIVES:
        return (
          <div className="p-8 max-w-4xl mx-auto w-full">
            <h2 className="text-3xl text-white mb-6 border-b border-gray-700 pb-2">ARCHIVES</h2>
            <div className="grid grid-cols-2 gap-4 text-white">
              <div className="bg-white/5 p-4">
                <div className="text-gray-400 text-sm">OPERATIVE</div>
                <div className="text-xl text-[#00f3ff]">{user?.username}</div>
              </div>
              <div className="bg-white/5 p-4">
                <div className="text-gray-400 text-sm">HIGH SCORE</div>
                <div className="text-xl text-green-500">{user?.highScore}</div>
              </div>
              <div className="bg-white/5 p-4">
                <div className="text-gray-400 text-sm">CUSTOM PACKETS</div>
                <div className="text-xl text-blue-500">{customWords.length}</div>
              </div>
            </div>
            <div className="mt-8">
              <CyberButton label="RETURN" onClick={() => setScreen(AppScreen.DASHBOARD)} />
            </div>
          </div>
        );

      case AppScreen.SETTINGS:
        return (
          <div className="p-8 max-w-2xl mx-auto w-full">
             <h2 className="text-3xl text-white mb-6 border-b border-gray-700 pb-2">SYSTEM CONFIG</h2>
             <div className="space-y-6">
               <div className="flex justify-between items-center bg-white/5 p-4">
                 <span className="text-white">AUDIO OUTPUT</span>
                 <button onClick={() => toggleSetting('soundEnabled')} className={`px-4 py-1 border ${settings.soundEnabled ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
                   {settings.soundEnabled ? 'ONLINE' : 'OFFLINE'}
                 </button>
               </div>
               <div className="flex justify-between items-center bg-white/5 p-4">
                 <span className="text-white">CRT EMULATION</span>
                 <button onClick={() => toggleSetting('crtEffects')} className={`px-4 py-1 border ${settings.crtEffects ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
                   {settings.crtEffects ? 'ACTIVE' : 'DISABLED'}
                 </button>
               </div>
             </div>
             <div className="mt-8">
               <CyberButton label="APPLY & RETURN" onClick={() => setScreen(AppScreen.DASHBOARD)} />
             </div>
          </div>
        );

      case AppScreen.TUTORIAL:
        return (
          <div className="p-8 max-w-4xl mx-auto w-full h-full overflow-y-auto scrollbar-hide">
            <h2 className="text-3xl text-white mb-6 border-b border-gray-700 pb-2">KNOWLEDGE BASE</h2>
            <div className="space-y-4">
              {Object.entries(CIPHER_DESCRIPTIONS).map(([key, desc]) => (
                <div key={key} className="bg-white/5 p-4 border-l-2 border-[#00f3ff]">
                  <h3 className="text-[#00f3ff] font-bold text-lg">{key}</h3>
                  <p className="text-gray-300 text-sm">{desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 pb-8">
               <CyberButton label="RETURN" onClick={() => setScreen(AppScreen.DASHBOARD)} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout settings={settings} screenKey={screen}>
      {renderScreen()}
    </Layout>
  );
};

export default App;
