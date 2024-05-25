function validateBooking(values) {
    let errors = {};

    if (!values.date) {
        errors.date = "Date should not be empty!";
    } else {
        errors.date = "";
    }

    if (!values.time || values.time.toString() === "00:00:00") {
        errors.time = "Time should not be empty!";
    } else {
        errors.time = "";
    }

    if (!values.service) {
        errors.service = "Service should not be empty!";
    } else {
        errors.service = "";
    }

    return errors;
}

export default validateBooking