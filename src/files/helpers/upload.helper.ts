import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

export class UploadFile {
  private static storage = new Storage({
    projectId: 'test-project-3657a', // Cambiar por tu ID de proyecto
    keyFilename: './serviceAccountKey.json', // Cambiar por tu archivo de claves
  });

  private static bucketName = 'test-project-3657a.appspot.com'; // Cambiar por tu bucket de Firebase
  static async uploadFile(
    file: Express.Multer.File,
    folder: string = '',
  ): Promise<string> {
    if (!file) {
      throw new Error('No se recibió ningún archivo.');
    }

    const uuid = uuidv4();
    const fileName = folder
      ? `${folder}/${Date.now()}-${file.originalname}`
      : `${Date.now()}-${file.originalname}`;

    const bucket = this.storage.bucket(this.bucketName);
    const fileUpload = bucket.file(fileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: uuid,
        },
      },
      resumable: false,
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => {
        console.error('Error al subir el archivo:', err);
        reject(new Error('Error al subir el archivo.'));
      });

      blobStream.on('finish', () => {
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${this.bucketName}/o/${encodeURIComponent(
          fileName,
        )}?alt=media&token=${uuid}`;
        resolve(publicUrl);
      });

      blobStream.end(file.buffer);
    });
  }
}
