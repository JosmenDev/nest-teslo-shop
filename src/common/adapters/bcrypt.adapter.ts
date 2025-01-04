import { Injectable } from "@nestjs/common";
import { EncryptionService } from "../interfaces/encryption-service.interface";
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptAdapter implements EncryptionService {
  hashSync(password: string, saltRounds: number): string {
    return bcrypt.hashSync(password, saltRounds);
  }

  async hash(password: string, saltRounds: number): Promise<string> {
    return bcrypt.hash(password, saltRounds);
  }
  compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

}