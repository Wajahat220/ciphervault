const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    originalFileName: {
      type: String,
      required: true,
    },
    encryptedFileName: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    encryptionType: {
      type: String,
      enum: ['AES', 'DES'],
      default: 'AES',
    },
    fileHash: {
      type: String,
      required: true,
    },
    digitalSignature: {
      type: String,
      default: null,
    },
    malwareStatus: {
      type: String,
      enum: ['clean', 'threat', 'pending'],
      default: 'pending',
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    mimeType: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('File', fileSchema);
