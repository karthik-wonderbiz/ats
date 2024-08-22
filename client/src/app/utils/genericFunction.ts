import CryptoJS from 'crypto-js';

export class EncryptDescrypt {
  private static encryptionKey = 'attendanceTrackerSystem';

  static encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.encryptionKey).toString();
  }

  static decrypt(encryptedValue: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedValue, this.encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}


export class ConcatName{
  static concatName(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`.trim();
  }
}

export class TimeFormatter {
  static formatTime(date: Date): string {
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());
    const seconds = this.padZero(date.getSeconds());
    return `${hours}:${minutes}:${seconds}`;
  }

  private static padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}