import { Bucket } from '@google-cloud/storage';
import { UuidAdapter } from 'src/common/adapters/uuid.adapter';

const uuidAdapter = new UuidAdapter();
export const uploadFile = (bucket: Bucket, file: Express.Multer.File, folder: string): Promise<string> => {
  const fileName = `${uuidAdapter.generatedUuid()}.${file.mimetype.split('/')[1]}`;
  const fileUpload = bucket.file(`${folder}/${fileName}`);

  return new Promise((resolve, reject) => {
    const blobStream = fileUpload.createWriteStream({
      resumable: false,
    });

    blobStream.on('error', (error) => reject(error));

    blobStream.on('finish', () => {
      fileUpload.makePublic();
      resolve(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
    });

    blobStream.end(file.buffer);
  });
};