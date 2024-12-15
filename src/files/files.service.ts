import { Injectable } from '@nestjs/common';
import { UploadFile } from './helpers/upload.helper';


@Injectable()
export class FilesService {

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    return await UploadFile.uploadFile(file, folder); // Carpeta opcional 'images'
  }
}
