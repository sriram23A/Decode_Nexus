export enum AppScreen {
  BOOT = 'BOOT',
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  GAME = 'GAME',
  ARCHIVES = 'ARCHIVES',
  SETTINGS = 'SETTINGS',
  TUTORIAL = 'TUTORIAL',
  UPLOAD = 'UPLOAD'
}

export enum CipherType {
  REVERSE = 'REVERSE',
  CAESAR = 'CAESAR',
  ATBASH = 'ATBASH',
  BASE64 = 'BASE64',
  BINARY = 'BINARY',
  HEX = 'HEX',
  ROT13 = 'ROT13'
}

export interface UserProfile {
  username: string;
  level: number;
  xp: number;
  highScore: number;
  matchesPlayed: number;
}

export interface GameState {
  isActive: boolean;
  currentWord: string;
  currentEncoded: string;
  cipherType: CipherType;
  difficulty: number;
  score: number;
  timeLeft: number;
  streak: number;
  hintsUsed: number;
}

export interface SystemSettings {
  soundEnabled: boolean;
  crtEffects: boolean;
  particleDensity: 'LOW' | 'HIGH';
  typingSpeed: number;
}

export interface LogEntry {
  id: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'ERROR' | 'WARNING';
  timestamp: string;
}
