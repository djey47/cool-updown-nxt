import { readFile } from 'fs/promises';

/**
 * @return Promise which resolves to String,
 * with the contents of SSH private key as per provided keyPath
 */
export async function readPrivateKey(privateKeyPath?: string) {
  if(!privateKeyPath) {
    return undefined;
  }
  const privateKey = await readFile(privateKeyPath, 'utf-8');

  // console.log('auth::readPrivateKey', { privateKeyPath, privateKey });

  return privateKey;
}
