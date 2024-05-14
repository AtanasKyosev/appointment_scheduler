function Validation(values) {
    let errors = {
        first_name: [],
        last_name: [],
        username: [],
        password: [],
    };
    const username_pattern = /^[a-zA-Z0-9_]+$/;

    if (values.first_name === "") {
        errors.first_name.push("First name should not be empty!");
    }

    if (values.last_name === "") {
        errors.last_name.push("Last name should not be empty!");
    }

    if (values.username === "") {
        errors.username.push("Username should not be empty!");
    }

    if (!username_pattern.test(values.username)) {
        errors.username.push("Username contains invalid characters!");
    }

    if (values.password === "") {
        errors.password.push("Password should not be empty!");
    }

    if (!/\d/.test(values.password)) {
        errors.password.push("Password must contain at least one digit!");
    }

    if (!/[a-z]/.test(values.password)) {
        errors.password.push("Password must contain at least one lowercase letter!");
    }

    if (!/[A-Z]/.test(values.password)) {
        errors.password.push("Password must contain at least one uppercase letter!");
    }

    return errors;
}

export default Validation;
