import { CipherType } from "../types";

export class CipherService {
  
  static encrypt(text: string, type: CipherType, difficulty: number): string {
    switch (type) {
      case CipherType.REVERSE:
        return text.split('').reverse().join('');
      
      case CipherType.CAESAR:
        const shift = Math.floor(Math.random() * 5) + 1 + Math.floor(difficulty / 2);
        return this.caesarShift(text, shift);
        
      case CipherType.ATBASH:
        return this.atbash(text);
        
      case CipherType.BASE64:
        return btoa(text);
        
      case CipherType.BINARY:
        return text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
        
      case CipherType.HEX:
        return text.split('').map(char => char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')).join(' ');
      
      case CipherType.ROT13:
        return this.caesarShift(text, 13);
        
      default:
        return text;
    }
  }

  private static caesarShift(str: string, amount: number): string {
    // Wrap amount
    if (amount < 0) return this.caesarShift(str, amount + 26);
    let output = '';
    for (let i = 0; i < str.length; i++) {
      let char = str[i];
      if (char.match(/[a-z]/i)) {
        const code = str.charCodeAt(i);
        // Uppercase letters
        if (code >= 65 && code <= 90) {
          char = String.fromCharCode(((code - 65 + amount) % 26) + 65);
        }
        // Lowercase letters
        else if (code >= 97 && code <= 122) {
          char = String.fromCharCode(((code - 97 + amount) % 26) + 97);
        }
      }
      output += char;
    }
    return output;
  }

  private static atbash(str: string): string {
    return str.replace(/[a-zA-Z]/g, (char) => {
      const code = char.charCodeAt(0);
      const a = char <= 'Z' ? 65 : 97;
      return String.fromCharCode(a + (25 - (code - a)));
    });
  }

  static getHint(word: string, currentEncoded: string, type: CipherType): string {
    switch (type) {
      case CipherType.REVERSE:
        return `First letter is: ${word[0]}`;
      case CipherType.CAESAR:
        return `Shift characters backward in alphabet`;
      case CipherType.ATBASH:
        return `A becomes Z, B becomes Y...`;
      case CipherType.BASE64:
        return `Standard web encoding. Ends in =?`;
      case CipherType.BINARY:
        return `ASCII Binary code. 01000001 = A`;
      case CipherType.HEX:
        return `Hexadecimal. 41 = A`;
      case CipherType.ROT13:
        return `Caesar shift of 13. A->N`;
      default:
        return "No hint available.";
    }
  }
}
