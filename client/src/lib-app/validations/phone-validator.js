import Validator from 'lib-app/validations/validator';

class PhoneValidator extends Validator {
    constructor(errorKey = 'ERROR_PHONE', validator = null) {
        super(validator);

        this.errorKey = errorKey;
    }

    validate(value, form) {
        let alphaMatch = /^\+?(\(\d+\))?[\d]+$/;

        if (!alphaMatch.test(value) || value.length < 6) return this.getError(this.errorKey);
    }
}

export default PhoneValidator;
