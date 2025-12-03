const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'data', 'users.json');

function ensureDataFileExists() {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(dataFilePath)) {
        fs.writeFileSync(dataFilePath, '[]', 'utf8');
    }
}

function readUsersFile() {
    ensureDataFileExists();

    try {
        const content = fs.readFileSync(dataFilePath, 'utf8');
        if (!content || !content.trim()) {
            return [];
        }
        const parsed = JSON.parse(content);
        if (!Array.isArray(parsed)) {
            return [];
        }
        return parsed;
    } catch {
        return [];
    }
}

function writeUsersFile(users) {
    ensureDataFileExists();
    fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2), 'utf8');
}

function getAllUsers() {
    return readUsersFile();
}

function getAllUsersWithoutSensitive() {
    const users = readUsersFile();
    return users.map(user => {
        const { passwordHash, passwordSalt, ...rest } = user;
        return rest;
    });
}

function findUserByEmail(email) {
    const users = readUsersFile();
    const target = email.toLowerCase();
    return users.find(u => typeof u.email === 'string' && u.email.toLowerCase() === target) || null;
}

function findUserById(id) {
    const users = readUsersFile();
    return users.find(u => u.id === id) || null;
}

function getUserWithoutSensitiveById(id) {
    const user = findUserById(id);
    if (!user) {
        return null;
    }
    const { passwordHash, passwordSalt, ...rest } = user;
    return rest;
}

function addUser(user) {
    const users = readUsersFile();
    users.push(user);
    writeUsersFile(users);
    return user;
}

function deleteUserById(id) {
    const users = readUsersFile();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) {
        return false;
    }
    users.splice(index, 1);
    writeUsersFile(users);
    return true;
}

module.exports = {
    getAllUsers,
    getAllUsersWithoutSensitive,
    findUserByEmail,
    findUserById,
    getUserWithoutSensitiveById,
    addUser,
    deleteUserById
};