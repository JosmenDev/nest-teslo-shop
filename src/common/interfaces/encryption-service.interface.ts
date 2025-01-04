export interface EncryptionService {
  hash(password: string, saltRounds: number): Promise<string>;
  hashSync(passwords: string, saltRounds: number): string;
  compare(password: string, hash: string): Promise<boolean>;
}