function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
}

function isValidEmail(email) {
    if (!isNonEmptyString(email)) {
        return false;
    }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateRegisterInput(body) {
    const errors = {};

    if (!isNonEmptyString(body.username)) {
        errors.username = 'Username is required';
    }
    if (!isNonEmptyString(body.firstName)) {
        errors.firstName = 'First name is required';
    }
    if (!isNonEmptyString(body.lastName)) {
        errors.lastName = 'Last name is required';
    }
    if (!isValidEmail(body.email)) {
        errors.email = 'Valid email is required';
    }
    if (!isNonEmptyString(body.password)) {
        errors.password = 'Password is required';
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}

function validateLoginInput(body) {
    const errors = {};

    if (!isValidEmail(body.email)) {
        errors.email = 'Valid email is required';
    }
    if (!isNonEmptyString(body.password)) {
        errors.password = 'Password is required';
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}

module.exports = {
    isNonEmptyString,
    isValidEmail,
    validateRegisterInput,
    validateLoginInput
};