const crypto = require('crypto');
const forge = require('node-forge');

// ─── AES-256 Encryption ───────────────────────────────────────────────────────

const AES_KEY = crypto
  .createHash('sha256')
  .update(process.env.AES_SECRET_KEY || 'ciphervault_aes_key')
  .digest(); // 32 bytes

function encryptAES(buffer) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', AES_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  // prepend IV to encrypted data
  return Buffer.concat([iv, encrypted]);
}

function decryptAES(buffer) {
  const iv = buffer.slice(0, 16);
  const encryptedData = buffer.slice(16);
  const decipher = crypto.createDecipheriv('aes-256-cbc', AES_KEY, iv);
  return Buffer.concat([decipher.update(encryptedData), decipher.final()]);
}

// ─── DES Encryption (for comparison only) ─────────────────────────────────────

const DES_KEY = crypto
  .createHash('md5')
  .update(process.env.AES_SECRET_KEY || 'ciphervault_des_key')
  .digest()
  .slice(0, 8); // DES needs 8 bytes

function encryptDES(buffer) {
  const iv = crypto.randomBytes(8);
  const cipher = forge.cipher.createCipher(
    'DES-CBC',
    forge.util.createBuffer(DES_KEY.toString('binary'))
  );

  cipher.start({ iv: forge.util.createBuffer(iv.toString('binary')) });
  cipher.update(forge.util.createBuffer(buffer.toString('binary')));
  cipher.finish();

  return Buffer.concat([iv, Buffer.from(cipher.output.getBytes(), 'binary')]);
}

function decryptDES(buffer) {
  const iv = buffer.slice(0, 8);
  const encryptedData = buffer.slice(8);
  const decipher = forge.cipher.createDecipher(
    'DES-CBC',
    forge.util.createBuffer(DES_KEY.toString('binary'))
  );

  decipher.start({ iv: forge.util.createBuffer(iv.toString('binary')) });
  decipher.update(forge.util.createBuffer(encryptedData.toString('binary')));

  if (!decipher.finish()) {
    throw new Error('DES decryption failed');
  }

  return Buffer.from(decipher.output.getBytes(), 'binary');
}

// ─── SHA-256 Hash ──────────────────────────────────────────────────────────────

function hashFile(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

// ─── Malware Detection (hash-based) ───────────────────────────────────────────

// Sample known malicious hashes (EICAR test hash and demo hashes)
const MALICIOUS_HASHES = new Set([
  '275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f', // EICAR test file
  '44d88612fea8a8f36de82e1278abb02f',
  'aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899',
]);

function checkMalware(hash) {
  return MALICIOUS_HASHES.has(hash) ? 'threat' : 'clean';
}

// ─── RSA Key Generation ────────────────────────────────────────────────────────

function generateRSAKeyPair() {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
  return { privateKey, publicKey };
}

// ─── RSA Digital Signature ────────────────────────────────────────────────────

// ─── RSA Digital Signature ────────────────────────────────────────────────────

function signFile(buffer, privateKeyPem) {
  try {
    // 1. Bulletproof the PEM string formatting against browser/FormData mangling
    const cleanKey = privateKeyPem
      .trim()
      .replace(/\\n/g, '\n')  // Fix escaped newlines
      .replace(/\r\n/g, '\n'); // Fix Windows carriage returns

    // 2. Generate the signature
    const sign = crypto.createSign('SHA256');
    sign.update(buffer);
    sign.end();
    
    return sign.sign(cleanKey, 'base64');
  } catch (error) {
    // 3. Print the EXACT reason it failed to the backend terminal
    console.error("🚨 CryptoUtils Signing Error:", error.message);
    throw new Error("Invalid private key format."); // Rethrow so the controller knows it failed
  }
}

function verifySignature(buffer, signature, publicKeyPem) {
  try {
    // Clean the public key just in case it got mangled in the database
    const cleanKey = publicKeyPem
      .trim()
      .replace(/\\n/g, '\n')
      .replace(/\r\n/g, '\n');

    const verify = crypto.createVerify('SHA256');
    verify.update(buffer);
    verify.end();
    
    return verify.verify(cleanKey, signature, 'base64');
  } catch (error) {
    console.error("🚨 CryptoUtils Verification Error:", error.message);
    return false;
  }
}

// ─── Performance Comparison ────────────────────────────────────────────────────

function measurePerformance(encryptFn, decryptFn, sizeKB = 100) {
  const data = crypto.randomBytes(sizeKB * 1024);

  const encStart = process.hrtime.bigint();
  const encrypted = encryptFn(data);
  const encEnd = process.hrtime.bigint();

  const decStart = process.hrtime.bigint();
  decryptFn(encrypted);
  const decEnd = process.hrtime.bigint();

  return {
    encryptionTimeMs: Number(encEnd - encStart) / 1_000_000,
    decryptionTimeMs: Number(decEnd - decStart) / 1_000_000,
    dataSizeKB: sizeKB,
  };
}

module.exports = {
  encryptAES,
  decryptAES,
  encryptDES,
  decryptDES,
  hashFile,
  checkMalware,
  generateRSAKeyPair,
  signFile,
  verifySignature,
  measurePerformance,
};
