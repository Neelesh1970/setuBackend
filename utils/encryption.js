const crypto = require('crypto');

// The generated key (64 hex characters = 32 bytes)
const ENCRYPTION_KEY = Buffer.from('a0afcb5e25c165443aa3e716c2eddbafb3376a76c5621661f0f486b5df9f3d72', 'hex'); // Must be 32 bytes (for AES-256)
const IV_LENGTH = 16; // For AES, this is always 16

// Encrypt function
function encrypt(text) {
    if (typeof text !== 'string') {
        text = text.toString();  // Convert to string if not already
    }
    let iv = crypto.randomBytes(IV_LENGTH); // Generate a random initialization vector
    let cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv); // AES-256-CBC mode
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    // Return IV and encrypted data (IV is needed for decryption)
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Decrypt function
function decrypt(text) {
    if (typeof text !== 'string') {
        text = text.toString();  // Convert to string if not already
    }

    let textParts = text.split(':'); // Ensure it's a string to split
    let iv = Buffer.from(textParts.shift(), 'hex'); // Extract IV
    let encryptedText = Buffer.from(textParts.join(':'), 'hex'); // Extract encrypted text
    let decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv); // AES-256-CBC mode
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString(); // Return decrypted text
}

module.exports = { encrypt, decrypt };
