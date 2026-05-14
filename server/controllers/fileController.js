const fs = require('fs');
const path = require('path');
const File = require('../models/File');
const User = require('../models/User');
const {
  encryptAES,
  decryptAES,
  hashFile,
  checkMalware,
  signFile,
  verifySignature,
} = require('../utils/cryptoUtils');

const UPLOAD_DIR = path.join(__dirname, '../uploads/encrypted');

// Ensure upload dir exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// @desc    Upload and encrypt a file
// @route   POST /api/files/upload
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileBuffer = req.file.buffer;
    const originalName = req.file.originalname;
    const mimeType = req.file.mimetype;
    const fileSize = req.file.size;

    // Step 1: Generate SHA256 hash
    const fileHash = hashFile(fileBuffer);

    // Step 2: Malware scan
    const malwareStatus = checkMalware(fileHash);
    if (malwareStatus === 'threat') {
      return res.status(400).json({
        message: '🚨 Malware detected! File upload rejected.',
        fileHash,
        malwareStatus: 'threat',
      });
    }

    // Step 3: AES-256 encrypt
    const encryptedBuffer = encryptAES(fileBuffer);

    // Step 4: RSA digital signature (sign the original file hash)
    const privateKeyPem = req.body.privateKey;
    let digitalSignature = null;

    if (privateKeyPem) {
      try {
        digitalSignature = signFile(Buffer.from(fileHash), privateKeyPem);
      } catch (error) {
        console.error('Signature generation failed:', error.message);
        return res.status(400).json({ message: 'Invalid private key format.' });
      }
    }

    // Step 5: Save encrypted file to disk
    const encryptedFileName = `${Date.now()}_${req.user._id}_enc`;
    const encryptedFilePath = path.join(UPLOAD_DIR, encryptedFileName);
    fs.writeFileSync(encryptedFilePath, encryptedBuffer);

    // Step 6: Save metadata to MongoDB
    const file = await File.create({
      originalFileName: originalName,
      encryptedFileName,
      uploadedBy: req.user._id,
      encryptionType: 'AES',
      fileHash,
      digitalSignature,
      malwareStatus: 'clean',
      fileSize,
      mimeType,
    });

    res.status(201).json({
      message: '✅ File uploaded, encrypted, and stored securely.',
      file: {
        _id: file._id,
        originalFileName: file.originalFileName,
        encryptionType: file.encryptionType,
        malwareStatus: file.malwareStatus,
        fileHash: file.fileHash,
        digitalSignature: file.digitalSignature ? '✔ Signed' : 'Not signed',
        uploadDate: file.createdAt,
        fileSize: file.fileSize,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    List all files for logged-in user
// @route   GET /api/files
const getFiles = async (req, res) => {
  try {
    const files = await File.find({ uploadedBy: req.user._id }).sort({ createdAt: -1 });

    res.json(
      files.map((f) => ({
        _id: f._id,
        originalFileName: f.originalFileName,
        encryptionType: f.encryptionType,
        malwareStatus: f.malwareStatus,
        fileHash: f.fileHash,
        isSigned: !!f.digitalSignature,
        uploadDate: f.createdAt,
        fileSize: f.fileSize,
        mimeType: f.mimeType,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download and decrypt a file
// @route   GET /api/files/:id/download
const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) return res.status(404).json({ message: 'File not found' });
    if (file.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const encryptedFilePath = path.join(UPLOAD_DIR, file.encryptedFileName);
    if (!fs.existsSync(encryptedFilePath)) {
      return res.status(404).json({ message: 'Encrypted file not found on disk' });
    }

    const encryptedBuffer = fs.readFileSync(encryptedFilePath);
    const decryptedBuffer = decryptAES(encryptedBuffer);

    res.set({
      'Content-Type': file.mimeType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${file.originalFileName}"`,
      'Content-Length': decryptedBuffer.length,
    });

    res.send(decryptedBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify RSA digital signature of a file
// @route   POST /api/files/:id/verify
const verifyFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });
    if (file.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!file.digitalSignature) {
      return res.json({ verified: false, message: 'This file has no digital signature.' });
    }

    // Get the uploader's public key
    const uploader = await User.findById(file.uploadedBy);
    if (!uploader || !uploader.publicKey) {
      return res.json({ verified: false, message: 'Uploader public key not found.' });
    }

    const isValid = verifySignature(
      Buffer.from(file.fileHash),
      file.digitalSignature,
      uploader.publicKey
    );

    res.json({
      verified: isValid,
      message: isValid
        ? '✅ Signature is valid. File is authentic and untampered.'
        : '❌ Signature verification failed. File may have been tampered.',
      fileHash: file.fileHash,
      uploadedBy: uploader.name,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a file
// @route   DELETE /api/files/:id
const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });
    if (file.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const filePath = path.join(UPLOAD_DIR, file.encryptedFileName);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await file.deleteOne();
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadFile, getFiles, downloadFile, verifyFile, deleteFile };
