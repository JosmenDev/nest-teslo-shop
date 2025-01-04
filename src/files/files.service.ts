// src/files/files.service.ts
import { Injectable } from '@nestjs/common';
import { initializeFirebase } from 'src/config/firebase.config';
import { uploadFile } from './helpers/upload.helper';

@Injectable()
export class FilesService {
  private storage = initializeFirebase();

  constructor() {}

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const bucket = this.storage.bucket();
    return await uploadFile(bucket, file, folder);
  }
  
}
