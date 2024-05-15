function Validation(values){
    let error = {};

    if (values.username === "") {
        error.username = "Username should not be empty!";
    } else {
        error.username = "";
    }

    if (values.first_name === "") {
        error.first_name = "First name should not be empty!";
    } else {
        error.first_name = "";
    }

    if (values.last_name === "") {
        error.last_name = "Last name should not be empty!";
    } else {
        error.last_name = "";
    }

    return error;
}

export default Validation;