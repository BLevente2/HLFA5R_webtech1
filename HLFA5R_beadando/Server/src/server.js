const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const crypto = require('crypto');
const selfsigned = require('selfsigned');

const { createPasswordHash, verifyPassword } = require('./passwordUtils');
const {
    getAllUsersWithoutSensitive,
    getUserWithoutSensitiveById,
    findUserByEmail,
    findUserById,
    addUser,
    deleteUserById
} = require('./userStore');
const {
    validateRegisterInput,
    validateLoginInput
} = require('./validators');

function generateId() {
    if (typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return crypto.randomBytes(16).toString('hex');
}

const certDir = path.join(__dirname, '..', 'cert');
const keyPath = path.join(certDir, 'server.key');
const certPath = path.join(certDir, 'server.crt');

function getCredentials() {
    try {
        const key = fs.readFileSync(keyPath, 'utf8');
        const cert = fs.readFileSync(certPath, 'utf8');
        if (key && cert) {
            return { key, cert };
        }
    } catch {}

    if (!fs.existsSync(certDir)) {
        fs.mkdirSync(certDir, { recursive: true });
    }

    const attrs = [{ name: 'commonName', value: 'localhost' }];
    const pems = selfsigned.generate(attrs, { days: 365 });

    fs.writeFileSync(keyPath, pems.private, 'utf8');
    fs.writeFileSync(certPath, pems.cert, 'utf8');

    return { key: pems.private, cert: pems.cert };
}

const app = express();

app.use(express.json());
app.use(cors());

app.post('/api/auth/register', (req, res) => {
    const { valid, errors } = validateRegisterInput(req.body);

    if (!valid) {
        return res.status(400).json({ errors });
    }

    const username = req.body.username.trim();
    const firstName = req.body.firstName.trim();
    const lastName = req.body.lastName.trim();
    const email = req.body.email.trim();
    const password = req.body.password;

    const existing = findUserByEmail(email);
    if (existing) {
        return res.status(409).json({ message: 'User with this email already exists' });
    }

    let passwordData;
    try {
        passwordData = createPasswordHash(password);
    } catch {
        return res.status(400).json({ message: 'Invalid password format' });
    }

    const user = {
        id: generateId(),
        email,
        username,
        firstName,
        lastName,
        passwordHash: passwordData.hash,
        passwordSalt: passwordData.salt
    };

    addUser(user);

    const { passwordHash, passwordSalt, ...publicUser } = user;
    return res.status(201).json(publicUser);
});

app.post('/api/auth/login', (req, res) => {
    const { valid, errors } = validateLoginInput(req.body);

    if (!valid) {
        return res.status(400).json({ errors });
    }

    const email = req.body.email.trim();
    const password = req.body.password;

    const user = findUserByEmail(email);
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const ok = verifyPassword(password, user.passwordSalt, user.passwordHash);
    if (!ok) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const { passwordHash, passwordSalt, ...publicUser } = user;
    return res.json(publicUser);
});

app.get('/api/users', (req, res) => {
    const users = getAllUsersWithoutSensitive();
    return res.json(users);
});

app.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const user = getUserWithoutSensitiveById(id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
});

app.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const existing = findUserById(id);

    if (!existing) {
        return res.status(404).json({ message: 'User not found' });
    }

    const success = deleteUserById(id);
    if (!success) {
        return res.status(500).json({ message: 'Could not delete user' });
    }

    return res.status(204).send();
});

const credentials = getCredentials();
const PORT = process.env.PORT || 8443;

https.createServer(credentials, app).listen(PORT, () => {
    console.log(`HTTPS server listening on port ${PORT}`);
});