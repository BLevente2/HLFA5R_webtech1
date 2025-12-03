const crypto = require('crypto');

const HASH_ALGORITHM = 'sha256';
const HASH_ITERATIONS = 100000;
const HASH_KEY_LENGTH = 32;
const SALT_LENGTH = 16;

function createPasswordHash(clientPasswordBase64) {
    if (typeof clientPasswordBase64 !== 'string') {
        throw new Error('Password must be a base64 string');
    }

    const passwordBuffer = Buffer.from(clientPasswordBase64, 'base64');
    const salt = crypto.randomBytes(SALT_LENGTH);
    const hash = crypto.pbkdf2Sync(
        passwordBuffer,
        salt,
        HASH_ITERATIONS,
        HASH_KEY_LENGTH,
        HASH_ALGORITHM
    );

    return {
        salt: salt.toString('hex'),
        hash: hash.toString('hex')
    };
}

function verifyPassword(clientPasswordBase64, saltHex, hashHex) {
    if (typeof clientPasswordBase64 !== 'string') {
        return false;
    }

    if (!saltHex || !hashHex) {
        return false;
    }

    try {
        const passwordBuffer = Buffer.from(clientPasswordBase64, 'base64');
        const salt = Buffer.from(saltHex, 'hex');
        const derivedHash = crypto.pbkdf2Sync(
            passwordBuffer,
            salt,
            HASH_ITERATIONS,
            HASH_KEY_LENGTH,
            HASH_ALGORITHM
        );
        const storedHash = Buffer.from(hashHex, 'hex');

        if (derivedHash.length !== storedHash.length) {
            return false;
        }

        return crypto.timingSafeEqual(derivedHash, storedHash);
    } catch {
        return false;
    }
}

module.exports = {
    createPasswordHash,
    verifyPassword
};