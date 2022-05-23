const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
module.exports.validateSignupInput = (email, username, password, confirmPassword) => {
    const errors = {};
    if (!email.trim()) {
        errors.email = 'email must not be empty';
    } else if (!email.match(regEx)) {
        errors.email = 'invalid email format';
    }

    if (!username.trim()) {
        errors.username = 'username must not be empty';
    }

    if (!password) {
        errors.password = 'password must not be empty';
    } else if (confirmPassword !== password) {
        errors.confirmPassword = 'must match password';
    }

    return {
        errors,
        valid: Object.keys(errors).length  < 1
    }
}

module.exports.validateSignInInput = (username, password) => {
    const errors = {};
    if (!username.trim()) {
        errors.username = 'username must not be empty';
    }

    if (!password) {
        errors.password = 'password must not be empty';
    }
    
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}