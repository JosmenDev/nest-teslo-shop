import * as admin from 'firebase-admin';

export const initializeFirebase  = () => {
  const serviceAccount = './serviceAccountKey.json';
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://test-project-3657a.appspot.com/', // Reemplaza con el nombre de tu bucket
  });
  return admin.storage();
};