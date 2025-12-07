import React from 'react';
import { audioService } from '../services/audioService';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost';
  label: string;
}

const CyberButton: React.FC<CyberButtonProps> = ({ variant = 'primary', label, className, ...props }) => {
  let baseClasses = "relative overflow-hidden font-bold py-3 px-6 transition-all duration-300 uppercase tracking-widest text-sm sm:text-base group active:scale-95 ";
  
  if (variant === 'primary') {
    baseClasses += "border border-[#00f3ff] text-[#00f3ff] hover:bg-[#00f3ff] hover:text-black hover:shadow-[0_0_25px_#00f3ff] ";
  } else if (variant === 'danger') {
    baseClasses += "border border-[#ff2a2a] text-[#ff2a2a] hover:bg-[#ff2a2a] hover:text-black hover:shadow-[0_0_25px_#ff2a2a] ";
  } else {
    baseClasses += "border border-transparent text-gray-400 hover:text-white hover:border-gray-500 ";
  }

  return (
    <button
      className={`${baseClasses} ${className || ''}`}
      onMouseEnter={() => audioService.play('hover')}
      onClick={() => audioService.play('click')}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{label}</span>
      {/* Glitch overlay effect on hover */}
      {variant !== 'ghost' && (
        <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 group-hover:left-[100%]" />
      )}
    </button>
  );
};

export default CyberButton;
