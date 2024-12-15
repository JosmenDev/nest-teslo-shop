import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import * as path from 'path';

// Ruta al archivo JSON con las credenciales del servicio
const serviceAccountPath = path.resolve(__dirname, '../../serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccountPath),
  storageBucket: 'gs://test-project-3657a.appspot.com/', // Cambia esto por el nombre de tu bucket
});

// Exporta la instancia del bucket para usarlo en otros módulos
export const firebaseStorage = getStorage().bucket();