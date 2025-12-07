import React, { useState, useRef } from 'react';
import { Upload, FileCode, CheckCircle, AlertTriangle } from 'lucide-react';
import CyberButton from './CyberButton';
import { audioService } from '../services/audioService';
import { AppScreen } from '../types';

interface UploadInterfaceProps {
  onBack: () => void;
  onAnalyze: (words: string[]) => void;
}

const UploadInterface: React.FC<UploadInterfaceProps> = ({ onBack, onAnalyze }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stats, setStats] = useState<{ found: number; size: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (uploadedFile: File) => {
    setFile(uploadedFile);
    setStats(null);
    audioService.play('click');
  };

  const analyzeCode = () => {
    if (!file) return;

    setIsAnalyzing(true);
    audioService.play('boot'); // Processing sound

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      
      // Simulation delay for effect
      setTimeout(() => {
        // Simple regex to extract words > 4 chars, uppercase
        const rawWords = text.match(/\b[a-zA-Z]{5,}\b/g) || [];
        const uniqueWords = Array.from(new Set(rawWords.map(w => w.toUpperCase())));
        
        // Filter out very common boring words if needed, but for now just take top 50
        const selectedWords = uniqueWords.slice(0, 50);

        setStats({
          found: selectedWords.length,
          size: (file.size / 1024).toFixed(2) + ' KB'
        });
        
        setIsAnalyzing(false);
        audioService.play('success');
        
        // Pass back to App
        if (selectedWords.length > 0) {
          onAnalyze(selectedWords);
        }
      }, 2000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-2 glitch-text">DATA EXTRACTION</h2>
      <p className="text-gray-400 mb-8 text-center max-w-lg">
        Upload source code or data logs. The system will decompile the file and generate cryptographic puzzles based on its content.
      </p>

      <div 
        className={`w-full max-w-xl h-64 border-2 border-dashed transition-all duration-300 rounded-lg flex flex-col items-center justify-center cursor-pointer relative overflow-hidden ${isDragging ? 'border-[#00f3ff] bg-[#00f3ff]/10' : 'border-gray-700 hover:border-gray-500 bg-black/40'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".txt,.js,.py,.html,.css,.json,.md,.cpp,.java" 
          onChange={(e) => e.target.files && processFile(e.target.files[0])}
        />
        
        {!file && !isAnalyzing && (
          <>
            <Upload size={48} className="text-gray-500 mb-4" />
            <div className="text-gray-300 font-bold">DROP FILE HERE OR CLICK TO BROWSE</div>
            <div className="text-xs text-gray-500 mt-2">SUPPORTED: TXT, JS, PY, HTML, JSON</div>
          </>
        )}

        {file && !isAnalyzing && !stats && (
          <div className="text-center animate-slide-in">
            <FileCode size={48} className="text-[#00f3ff] mx-auto mb-4" />
            <div className="text-white font-bold text-lg">{file.name}</div>
            <div className="text-xs text-gray-400 mt-1">{(file.size / 1024).toFixed(2)} KB</div>
            <div className="mt-4 text-green-500 text-xs">READY FOR ANALYSIS</div>
          </div>
        )}

        {isAnalyzing && (
          <div className="text-center w-full px-10">
            <div className="text-[#00f3ff] mb-4 animate-pulse">DECOMPILING SOURCE...</div>
            <div className="h-1 w-full bg-gray-800 overflow-hidden">
               <div className="h-full bg-[#00f3ff] animate-[slideInRight_2s_linear]" />
            </div>
            <div className="font-mono text-[10px] text-green-500 mt-2 text-left opacity-70">
              {">"} PARSING TOKENS...<br/>
              {">"} IDENTIFYING VARIABLES...<br/>
              {">"} EXTRACTING STRINGS...
            </div>
          </div>
        )}

        {stats && (
          <div className="text-center animate-slide-in">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <div className="text-white font-bold text-lg">EXTRACTION COMPLETE</div>
            <div className="text-[#00f3ff] text-xl font-bold mt-2">{stats.found} KEYWORDS FOUND</div>
            <div className="text-xs text-gray-400 mt-1">Data injected into system memory.</div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-8">
        <CyberButton label="RETURN" variant="ghost" onClick={onBack} />
        <CyberButton 
          label={stats ? "START SIMULATION" : "ANALYZE PACKET"} 
          onClick={stats ? () => onAnalyze([]) : analyzeCode} // If stats exist, analyze just proceeds (words already passed)
          disabled={!file || isAnalyzing}
          className={!file ? 'opacity-50 cursor-not-allowed' : ''}
        />
      </div>
    </div>
  );
};

export default UploadInterface;
