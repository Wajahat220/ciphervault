const { encryptAES, decryptAES, encryptDES, decryptDES, measurePerformance } = require('../utils/cryptoUtils');

// @desc    AES performance test
// @route   GET /api/test/aes-performance
const aesPerformance = (req, res) => {
  try {
    const sizes = [10, 50, 100];
    const results = sizes.map((sizeKB) => {
      const perf = measurePerformance(encryptAES, decryptAES, sizeKB);
      return { sizeKB, ...perf };
    });

    res.json({
      algorithm: 'AES-256-CBC',
      keySize: '256 bits',
      blockSize: '128 bits',
      security: 'Strong (Modern Standard)',
      results,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    DES performance test
// @route   GET /api/test/des-performance
const desPerformance = (req, res) => {
  try {
    const sizes = [10, 50, 100];
    const results = sizes.map((sizeKB) => {
      const perf = measurePerformance(encryptDES, decryptDES, sizeKB);
      return { sizeKB, ...perf };
    });

    res.json({
      algorithm: 'DES-CBC',
      keySize: '56 bits (effective)',
      blockSize: '64 bits',
      security: 'Weak (Deprecated — for educational comparison only)',
      results,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Combined comparison
// @route   GET /api/test/comparison
const comparison = (req, res) => {
  try {
    const sizeKB = 100;
    const aes = measurePerformance(encryptAES, decryptAES, sizeKB);
    const des = measurePerformance(encryptDES, decryptDES, sizeKB);

    res.json({
      testSizeKB: sizeKB,
      aes: {
        algorithm: 'AES-256-CBC',
        keySize: '256 bits',
        blockSize: '128 bits',
        status: 'Secure',
        encryptionTimeMs: aes.encryptionTimeMs,
        decryptionTimeMs: aes.decryptionTimeMs,
      },
      des: {
        algorithm: 'DES-CBC',
        keySize: '56 bits',
        blockSize: '64 bits',
        status: 'Deprecated',
        encryptionTimeMs: des.encryptionTimeMs,
        decryptionTimeMs: des.decryptionTimeMs,
      },
      verdict: 'AES-256 is the industry standard. DES is considered broken and should never be used in production.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { aesPerformance, desPerformance, comparison };
