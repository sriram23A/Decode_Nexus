import { CipherType } from "./types";

export const WORD_LIST = [
  "ALGORITHM", "BANDWIDTH", "CYBERPUNK", "DATABASE", "ENCRYPTION", 
  "FIREWALL", "GIGABYTE", "HARDWARE", "INTERFACE", "JAVASCRIPT", 
  "KERNEL", "LATENCY", "MALWARE", "NETWORK", "OPERATING", 
  "PROTOCOL", "QUANTUM", "RUNTIME", "SERVER", "TERMINAL",
  "MAINFRAME", "BACKDOOR", "DECRYPT", "BINARY", "HEXADECIMAL",
  "SYNTAX", "COMPILE", "DEBUGGER", "ETHERNET", "FIRMWARE",
  "GATEWAY", "HACKER", "IPADDRESS", "KEYLOGGER", "LOGICBOMB",
  "MEMORY", "NANOTECH", "OVERCLOCK", "PACKET", "PHISHING",
  "ROOTKIT", "SPYWARE", "TROJAN", "UPLOAD", "VIRTUAL",
  "WIRELESS", "ZERO_DAY", "AUTHENTICATE", "BLOCKCHAIN", "CLOUD"
];

export const INITIAL_TIME = 60; // seconds
export const HINT_PENALTY = 50;
export const SKIP_PENALTY = 100;
export const WRONG_PENALTY = 25;

export const CIPHER_DESCRIPTIONS: Record<CipherType, string> = {
  [CipherType.REVERSE]: "The text string has been reversed. Read it backwards.",
  [CipherType.CAESAR]: "Characters are shifted down the alphabet. Try shifting them back.",
  [CipherType.ATBASH]: "Alphabet is mirrored (A=Z, B=Y). Flip the characters.",
  [CipherType.BASE64]: "Standard Base64 encoding. Ends with '=' usually.",
  [CipherType.BINARY]: "8-bit ASCII binary representation. 0s and 1s.",
  [CipherType.HEX]: "Hexadecimal ASCII representation. Pairs of hex digits.",
  [CipherType.ROT13]: "A specific Caesar cipher with a shift of 13 places."
};

export const LEVEL_CONFIG = {
  1: [CipherType.REVERSE],
  2: [CipherType.REVERSE, CipherType.CAESAR],
  3: [CipherType.CAESAR, CipherType.ATBASH],
  4: [CipherType.ATBASH, CipherType.ROT13],
  5: [CipherType.ROT13, CipherType.BASE64],
  6: [CipherType.BASE64, CipherType.HEX],
  7: [CipherType.HEX, CipherType.BINARY],
  8: [CipherType.BINARY, CipherType.CAESAR, CipherType.REVERSE],
  9: [CipherType.BASE64, CipherType.BINARY, CipherType.HEX],
  10: Object.values(CipherType) // All chaos
};
